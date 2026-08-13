'use client';

import { useMemo } from 'react';
import { type ResumeData } from '@/components/dashboard/resume-component';
import { segmentTextByKeywords } from '@/lib/utils/keyword-matcher';
import { FileUser, Briefcase, GraduationCap, FolderKanban, Wrench } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface HighlightedResumeViewProps {
  resumeData: ResumeData;
  keywords: Set<string>;
}

/**
 * Display resume content with matching keywords highlighted.
 * Shows all resume sections with visual highlighting of JD matches.
 */
export function HighlightedResumeView({ resumeData, keywords }: HighlightedResumeViewProps) {
  const { t } = useTranslations();

  // Drop blank/whitespace-only entries so empty lines (e.g. from editing in the
  // builder) never render in the preview (issue #763).
  const visibleTechnicalSkills =
    resumeData.additional?.technicalSkills?.filter(
      (item): item is string => typeof item === 'string' && item.trim() !== ''
    ) ?? [];
  const visibleLanguages =
    resumeData.additional?.languages?.filter(
      (item): item is string => typeof item === 'string' && item.trim() !== ''
    ) ?? [];
  const visibleCertificationsTraining =
    resumeData.additional?.certificationsTraining?.filter(
      (item): item is string => typeof item === 'string' && item.trim() !== ''
    ) ?? [];

  return (
    <div className="h-full flex flex-col bg-card text-foreground">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border bg-secondary">
        <FileUser className="w-4 h-4 text-primary" />
        <h3 className="font-mono text-sm font-bold uppercase text-foreground">
          {t('builder.jdMatch.yourResume')}
        </h3>
        <span className="text-xs text-muted-foreground ml-2">
          {t('builder.jdMatch.matchingKeywordsHighlighted')}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-background">
        {/* Summary */}
        {resumeData.summary && (
          <Section title={t('resume.sections.summary')} icon={<FileUser className="w-4 h-4 text-primary" />}>
            <HighlightedText text={resumeData.summary} keywords={keywords} />
          </Section>
        )}

        {/* Work Experience */}
        {resumeData.workExperience && resumeData.workExperience.length > 0 && (
          <Section title={t('resume.sections.experience')} icon={<Briefcase className="w-4 h-4 text-primary" />}>
            {resumeData.workExperience.map((exp) => (
              <div key={exp.id} className="mb-4 last:mb-0">
                <div className="font-semibold text-foreground">
                  <HighlightedText text={exp.title || ''} keywords={keywords} />
                  {exp.company && (
                    <span className="text-foreground">
                      {t('builder.jdMatch.atSeparator')}
                      <HighlightedText text={exp.company} keywords={keywords} />
                    </span>
                  )}
                </div>
                {exp.years && <div className="text-xs text-muted-foreground mb-1">{exp.years}</div>}
                {exp.description && (
                  <ul className="space-y-1 text-sm">
                    {exp.description.map((bullet, i) => {
                      // M-02: honour the per-row bullet/plain setting so this
                      // preview agrees with the resume preview and the PDF.
                      const showMarker = exp.descriptionStyles?.[i] !== 'plain';
                      return (
                        <li key={i} className={cn('flex text-foreground', showMarker && 'ml-4')}>
                          {showMarker && (
                            <span className="mr-1.5 flex-shrink-0 text-muted-foreground" aria-hidden="true">
                              &bull;&nbsp;
                            </span>
                          )}
                          <span>
                            <HighlightedText text={bullet} keywords={keywords} />
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {resumeData.education && resumeData.education.length > 0 && (
          <Section
            title={t('resume.sections.education')}
            icon={<GraduationCap className="w-4 h-4 text-primary" />}
          >
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="mb-3 last:mb-0">
                <div className="font-semibold text-foreground">
                  <HighlightedText text={edu.degree || ''} keywords={keywords} />
                </div>
                {edu.institution && (
                  <div className="text-sm text-foreground">
                    <HighlightedText text={edu.institution} keywords={keywords} />
                  </div>
                )}
                {edu.years && <div className="text-xs text-muted-foreground">{edu.years}</div>}
              </div>
            ))}
          </Section>
        )}

        {/* Projects */}
        {resumeData.personalProjects && resumeData.personalProjects.length > 0 && (
          <Section
            title={t('resume.sections.projects')}
            icon={<FolderKanban className="w-4 h-4 text-primary" />}
          >
            {resumeData.personalProjects.map((proj) => (
              <div key={proj.id} className="mb-4 last:mb-0">
                <div className="font-semibold text-foreground">
                  <HighlightedText text={proj.name || ''} keywords={keywords} />
                  {proj.role && (
                    <span className="text-foreground font-normal">
                      {' '}
                      {t('builder.jdMatch.roleSeparator')}{' '}
                      <HighlightedText text={proj.role} keywords={keywords} />
                    </span>
                  )}
                </div>
                {proj.years && <div className="text-xs text-muted-foreground mb-1">{proj.years}</div>}
                {proj.description && (
                  <ul className="space-y-1 text-sm">
                    {proj.description.map((bullet, i) => {
                      const showMarker = proj.descriptionStyles?.[i] !== 'plain';
                      return (
                        <li key={i} className={cn('flex text-foreground', showMarker && 'ml-4')}>
                          {showMarker && (
                            <span className="mr-1.5 flex-shrink-0 text-muted-foreground" aria-hidden="true">
                              &bull;&nbsp;
                            </span>
                          )}
                          <span>
                            <HighlightedText text={bullet} keywords={keywords} />
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {resumeData.additional && (
          <Section title={t('resume.sections.skills')} icon={<Wrench className="w-4 h-4 text-primary" />}>
            {visibleTechnicalSkills.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-mono uppercase text-muted-foreground mb-1">
                  {t('resume.additional.technicalSkills')}
                </div>
                <div className="flex flex-wrap gap-1">
                  {visibleTechnicalSkills.map((skill, i) => (
                    <SkillTag key={i} text={skill} keywords={keywords} />
                  ))}
                </div>
              </div>
            )}

            {visibleLanguages.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-mono uppercase text-muted-foreground mb-1">
                  {t('resume.sections.languages')}
                </div>
                <div className="flex flex-wrap gap-1">
                  {visibleLanguages.map((lang, i) => (
                    <SkillTag key={i} text={lang} keywords={keywords} />
                  ))}
                </div>
              </div>
            )}

            {visibleCertificationsTraining.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-mono uppercase text-muted-foreground mb-1">
                  {t('resume.sections.certifications')}
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {visibleCertificationsTraining.map((cert, i) => (
                    <li key={i} className="text-foreground">
                      <HighlightedText text={cert} keywords={keywords} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        )}
      </div>
    </div>
  );
}

/**
 * Section wrapper component
 */
function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border bg-card rounded-none text-foreground">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-secondary">
        {icon}
        <span className="font-mono text-xs font-bold uppercase text-foreground">{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

/**
 * Component to render text with highlighted keywords.
 */
function HighlightedText({ text, keywords }: { text: string; keywords: Set<string> }) {
  const segments = useMemo(() => segmentTextByKeywords(text, keywords), [text, keywords]);

  return (
    <span>
      {segments.map((segment, i) =>
        segment.isMatch ? (
          <mark key={i} className="bg-amber-300 dark:bg-amber-400 text-zinc-950 font-medium px-0.5">
            {segment.text}
          </mark>
        ) : (
          <span key={i}>{segment.text}</span>
        )
      )}
    </span>
  );
}

/**
 * Skill tag with optional highlighting
 */
function SkillTag({ text, keywords }: { text: string; keywords: Set<string> }) {
  const isMatch = keywords.has(text.toLowerCase());

  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs border border-border ${
        isMatch
          ? 'bg-amber-300 dark:bg-amber-400 text-zinc-950 font-medium border-amber-500'
          : 'bg-muted text-foreground'
      }`}
    >
      {text}
    </span>
  );
}
