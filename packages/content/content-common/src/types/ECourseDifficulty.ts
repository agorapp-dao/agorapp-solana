export enum ECourseDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export interface TDifficultyInfo {
  name: string;
  filter: boolean;
}

export const defCourseDifficulty: { [key in ECourseDifficulty]: TDifficultyInfo } = {
  [ECourseDifficulty.BEGINNER]: {
    name: 'Beginner',
    filter: true,
  },
  [ECourseDifficulty.INTERMEDIATE]: {
    name: 'Intermediate',
    filter: true,
  },
  [ECourseDifficulty.ADVANCED]: {
    name: 'Advanced',
    filter: true,
  },
};
