import React from 'react';
import { motion } from 'motion/react';
import { WeddingData } from '../types/wedding';
import { FamilyMember } from '../types/platform';

interface FamilyInvitationSectionProps {
  data: WeddingData;
  familyMembers?: FamilyMember[];
}

export const FamilyInvitationSection: React.FC<FamilyInvitationSectionProps> = ({
  data,
  familyMembers = []
}) => {
  return (
    <section id="family-blessings-section" className="relative px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* Arch Card traditional look */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="parchment-card relative rounded-3xl border-2 border-[#D4AF37]/40 p-8 sm:p-12 shadow-lg"
        >
          {/* Top Traditional Motif */}
          <div className="mb-4 flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37] bg-[#FAF5EB]">
              <span className="font-cinzel text-xs font-bold text-[#A88234]">
                {data.monogram}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="h-px w-12 bg-[#D4AF37]/50" />
              <span className="text-[#C59B27] text-xs">✦</span>
              <span className="h-px w-12 bg-[#D4AF37]/50" />
            </div>
          </div>

          <h3 className="font-cinzel text-xs font-bold tracking-[0.3em] text-[#7E6649] uppercase sm:text-sm">
            {data.familyBlessingsTitle}
          </h3>

          <div className="my-6 space-y-3">
            <h4 className="font-serif-luxury text-2xl font-medium text-[#2E221B] sm:text-3xl">
              {data.brideParents}
            </h4>
            <p className="font-script text-2xl text-[#C59B27]">&</p>
            <h4 className="font-serif-luxury text-2xl font-medium text-[#2E221B] sm:text-3xl">
              {data.groomParents}
            </h4>
          </div>

          <p className="font-serif-luxury mx-auto max-w-lg text-sm italic leading-relaxed text-[#5C4A3A] sm:text-base">
            {data.familyBlessingsBody}
          </p>

          {/* Extended Family Members if specified */}
          {familyMembers.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#D4AF37]/25">
              <p className="font-cinzel text-xs font-bold tracking-widest text-[#8C7653] uppercase mb-4">
                Together With Loving Family
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E0D1B8] bg-[#FAF7F2] px-3.5 py-1 text-xs text-[#3D312A] shadow-2xs"
                  >
                    <span className="font-medium">{member.name}</span>
                    <span className="text-[10px] text-[#8C7653] bg-white px-1.5 py-0.5 rounded-full border border-[#EAE0D0]">
                      {member.relation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-[#D4AF37]/30 pt-6">
            <p className="font-cinzel text-xs font-semibold tracking-widest text-[#8C7653] uppercase">
              Cordially Invited By
            </p>
            <p className="font-serif-luxury mt-1 text-xl font-normal text-[#382B21]">
              {data.hostFamilies}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
