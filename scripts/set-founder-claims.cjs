/**
 * SVT - Scholars Volunteer Team
 * Secure Founder & Administrator Custom Claims Assignment Script
 * 
 * Usage:
 *   node scripts/set-founder-claims.cjs [optional-email]
 * 
 * Security:
 *   - Uses Application Default Credentials (ADC) or the secure Firebase Admin environment.
 *   - NO service account keys or credentials hardcoded or committed to git.
 *   - Sets custom claims: { admin: true, role: 'admin' } directly in Firebase Authentication.
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin with Application Default Credentials
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || 'ai-studio-9935d7a5-b282-457e-a013-29f751feaa7f'
    });
  } catch (err) {
    admin.initializeApp();
  }
}

const targetEmail = process.argv[2] || process.env.FOUNDER_EMAIL || 'sallumrazak@gmail.com';

async function setFounderClaims() {
  console.log(`\n======================================================`);
  console.log(`  SVT Firebase Admin SDK - Assign Founder Custom Claims`);
  console.log(`======================================================\n`);
  console.log(`Target account: ${targetEmail}`);

  try {
    // 1. Look up user by email in Firebase Auth
    const userRecord = await admin.auth().getUserByEmail(targetEmail);
    console.log(`Found Auth User:`);
    console.log(` - UID: ${userRecord.uid}`);
    console.log(` - Email: ${userRecord.email}`);
    console.log(` - Display Name: ${userRecord.displayName || '(none)'}`);
    console.log(` - Existing Claims:`, userRecord.customClaims || '(none)');

    // 2. Set Custom User Claims: admin: true, role: 'admin'
    const newClaims = {
      admin: true,
      role: 'admin',
      coordinator: true
    };

    await admin.auth().setCustomUserClaims(userRecord.uid, newClaims);
    console.log(`\n Successfully assigned custom claims to UID: ${userRecord.uid}`);
    console.log(`   New claims:`, newClaims);

    // 3. Ensure Firestore member document has active admin status
    const db = admin.firestore();
    const memberDocRef = db.collection('members').doc(userRecord.uid);
    const memberSnap = await memberDocRef.get();

    const founderData = {
      uid: userRecord.uid,
      name: userRecord.displayName || 'Salman A.Razak',
      displayName: userRecord.displayName || 'Salman A.Razak',
      email: userRecord.email,
      role: 'admin',
      status: 'active',
      hasCrown: true,
      customBadge: 'Founder & Executive Leader',
      directoryVisible: true,
      totalApprovedMinutes: 12000,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (!memberSnap.exists) {
      founderData.joinedAt = admin.firestore.FieldValue.serverTimestamp();
      await memberDocRef.set(founderData);
      console.log(` Created active founder member document in Firestore /members/${userRecord.uid}`);
    } else {
      await memberDocRef.set(founderData, { merge: true });
      console.log(` Updated active founder member document in Firestore /members/${userRecord.uid}`);
    }

    // 4. Update public profile
    const publicDocRef = db.collection('publicProfiles').doc(userRecord.uid);
    await publicDocRef.set({
      uid: userRecord.uid,
      name: userRecord.displayName || 'Salman A.Razak',
      displayName: userRecord.displayName || 'Salman A.Razak',
      role: 'admin',
      status: 'active',
      hasCrown: true,
      customBadge: 'Founder & Executive Leader',
      directoryVisible: true,
      totalApprovedMinutes: 12000,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log(` Updated public profile in Firestore /publicProfiles/${userRecord.uid}`);

    console.log(`\n======================================================`);
    console.log(` NEXT STEPS FOR THE FOUNDER:`);
    console.log(` 1. In the SVT web application, click your profile in the`);
    console.log(`    top-right navigation or click "Refresh Permissions".`);
    console.log(` 2. Firebase will refresh the ID token and read the new claims.`);
    console.log(` 3. The full "Administration" portal and "Founder & Administrator"`);
    console.log(`    badge will immediately become active.`);
    console.log(`======================================================\n`);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`\n Error: No Firebase Auth account found for email "${targetEmail}".`);
      console.error(` The user must first sign in at least once via Google or email/password.`);
    } else {
      console.error(`\n Error assigning custom claims:`, error);
    }
    process.exit(1);
  }
}

setFounderClaims();
