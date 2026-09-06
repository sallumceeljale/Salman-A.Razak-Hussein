import React from 'react';
import salmanPhoto from '../assets/images/salman-arazak-hussein.jpg';
import najmPhoto from '../assets/images/najm-bazel.jpg';
import mohamedPhoto from '../assets/images/mohamed-seif.png';
import EditablePublicAssetImage from './EditablePublicAssetImage';

interface LeaderMember {
  id: string;
  assetKey: string;
  name: string;
  role: string;
  description: string;
  altText: string;
  imageSrc: string;
  objectPosition: string;
  linkedinUrl: string;
  linkedinAriaLabel: string;
}

const LinkedInBadgeIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect width="24" height="24" rx="4.8" fill="#0A66C2" />
    <path
      d="M19 19h-3.125v-4.89c0-1.166-.023-2.666-1.624-2.666-1.626 0-1.875 1.27-1.875 2.582V19H9.25V8.95h2.999v1.373h.042c.418-.792 1.44-1.627 2.963-1.627 3.17 0 3.75 2.087 3.75 4.801V19zM6.166 7.575a1.813 1.813 0 110-3.626 1.813 1.813 0 010 3.626zM4.604 19h3.125V8.95H4.604V19z"
      fill="#FFFFFF"
    />
  </svg>
);

const LEADERSHIP_MEMBERS: LeaderMember[] = [
  {
    id: 'salman-arazak-hussein',
    assetKey: 'leadership-salman',
    name: 'Salman A.razak Hussein',
    role: 'Founder & Leader',
    description: 'Salman founded SVT to connect students, make useful guidance easier to understand, and create meaningful opportunities for students to learn, volunteer, and lead.',
    altText: 'Salman A.razak Hussein, SVT Founder and Leader',
    imageSrc: salmanPhoto,
    objectPosition: 'center 20%',
    linkedinUrl: 'https://www.linkedin.com/in/salman-a-razak-hussein/',
    linkedinAriaLabel: 'View Salman A.razak Hussein’s LinkedIn profile'
  },
  {
    id: 'najm-bazel',
    assetKey: 'leadership-najm',
    name: 'Najm Bazel',
    role: 'Senior Project Manager',
    description: 'Najm helps organize SVT initiatives, coordinate responsibilities, and keep student-led projects focused, structured, and moving forward.',
    altText: 'Najm Bazel, SVT Senior Project Manager',
    imageSrc: najmPhoto,
    objectPosition: 'center 18%',
    linkedinUrl: 'https://www.linkedin.com/in/najm-bazel-7094b4430/',
    linkedinAriaLabel: 'View Najm Bazel’s LinkedIn profile'
  },
  {
    id: 'mohamed-seif',
    assetKey: 'leadership-mohamed',
    name: 'Mohamed Seif',
    role: 'Design Manager',
    description: 'Mohamed supports SVT’s visual identity and helps create clear, consistent, and student-friendly designs for the organization’s projects and resources.',
    altText: 'Mohamed Seif, SVT Design Manager',
    imageSrc: mohamedPhoto,
    objectPosition: 'center 20%',
    linkedinUrl: 'https://www.linkedin.com/in/mohamed-seif-baa925413/',
    linkedinAriaLabel: 'View Mohamed Seif’s LinkedIn profile'
  }
];

export const LeadershipTeamSection: React.FC = () => {
  return (
    <section 
      id="leadership-team" 
      aria-labelledby="leadership-team-heading" 
      className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left scroll-mt-24 relative"
    >
      <div id="leadership" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <h2 
          id="leadership-team-heading" 
          className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-sans text-slate-900 tracking-tight leading-tight"
        >
          Meet the students building SVT
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-sans max-w-[65ch] mx-auto">
          A small team of high school and university students creating open study resources, organizing peer tutoring, and helping other students succeed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {LEADERSHIP_MEMBERS.map((member) => (
          <div
            key={member.id}
            id={`leader-card-${member.id}`}
            className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs flex flex-col h-full transition-colors duration-150 hover:border-slate-300"
          >
            {/* 1:1 Image Container */}
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-100 mb-5 relative border border-slate-200">
              <EditablePublicAssetImage
                assetKey={member.assetKey}
                fallbackSrc={member.imageSrc}
                fallbackAlt={member.altText}
                label={`${member.name} (${member.role})`}
                objectPosition={member.objectPosition}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover"
              />
            </div>

            {/* Member Details Header: Name & Role on left, Compact Official LinkedIn Badge on right */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-[22px] font-semibold font-sans text-slate-900 leading-snug">
                  {member.name}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-teal-700 mt-0.5 tracking-wide font-sans">
                  {member.role}
                </p>
              </div>

              {/* Official LinkedIn Badge */}
              <div className="relative group/linkedin flex-shrink-0">
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={member.linkedinAriaLabel}
                  title="View LinkedIn profile"
                  className="w-10 h-10 min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2"
                >
                  <div className="w-7 h-7 rounded-md overflow-hidden shadow-xs hover:brightness-105 transition-all duration-150 flex items-center justify-center">
                    <LinkedInBadgeIcon className="w-full h-full" />
                  </div>

                  {/* Tooltip on hover and keyboard focus */}
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute -top-8 right-0 opacity-0 group-hover/linkedin:opacity-100 group-focus-within/linkedin:opacity-100 transition-opacity duration-150 bg-slate-900 text-white text-xs font-medium px-2 py-1 rounded-md shadow-md whitespace-nowrap z-20"
                  >
                    View LinkedIn profile
                  </span>
                </a>
              </div>
            </div>

            {/* Member Description */}
            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mt-1 flex-grow font-sans">
              {member.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
