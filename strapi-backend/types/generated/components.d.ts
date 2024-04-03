import type { Schema, Attribute } from '@strapi/strapi';

export interface NewHireNewHire extends Schema.Component {
  collectionName: 'components_new_hire_new_hires';
  info: {
    displayName: 'newHire';
  };
  attributes: {
    memberName: Attribute.String;
    quizStatus: Attribute.Boolean & Attribute.DefaultTo<false>;
    submissionDocs: Attribute.Component<
      'submission-docs.submission-document',
      true
    >;
    quizResult: Attribute.JSON;
  };
}

export interface SubmissionDocsSubmissionDocument extends Schema.Component {
  collectionName: 'components_submission_docs_submission_document_s';
  info: {
    displayName: 'submissionDocument ';
  };
  attributes: {
    submissionName: Attribute.String;
    linktoFile: Attribute.String;
  };
}

export interface TeamLearningTeamLearning extends Schema.Component {
  collectionName: 'components_team_learning_team_learnings';
  info: {
    displayName: 'teamLearning';
  };
  attributes: {
    materialName: Attribute.String;
    materialLink: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'new-hire.new-hire': NewHireNewHire;
      'submission-docs.submission-document': SubmissionDocsSubmissionDocument;
      'team-learning.team-learning': TeamLearningTeamLearning;
    }
  }
}
