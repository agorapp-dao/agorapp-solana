import * as S from './ContentItem.styled';
import React from 'react';
import { TLesson } from '@agorapp-dao/content-common';
import { ContentItem } from './ContentItem';

interface TProps {
  lessons: TLesson[];
  level: number;
  handleSelectLesson: (slug: string) => void;
  enableLessonsWithProgress?: boolean;
}

export const ContentLevel: React.FC<TProps> = ({
  lessons,
  level,
  handleSelectLesson,
  enableLessonsWithProgress,
}: TProps) => {
  return (
    <S.Wrapper level={level}>
      {lessons.map((item, index) => (
        <div key={item.slug}>
          <ContentItem
            item={item}
            level={level}
            handleSelectLesson={handleSelectLesson}
            enableLessonsWithProgress={enableLessonsWithProgress}
          />
        </div>
      ))}
    </S.Wrapper>
  );
};
