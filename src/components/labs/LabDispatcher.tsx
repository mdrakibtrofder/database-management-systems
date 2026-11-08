import React from 'react';
import { SqlPlaygroundLab } from './SqlPlaygroundLab';
import { BTreeLab } from './BTreeLab';
import { PrecedenceGraphLab } from './PrecedenceGraphLab';
import { NormalizationLab } from './NormalizationLab';
import { JoinVisualizerLab } from './JoinVisualizerLab';
import { RecoveryLab } from './RecoveryLab';
import { AnsiSparcLab } from './AnsiSparcLab';
import { ErMapperLab } from './ErMapperLab';
import { RaidLab } from './RaidLab';
import { AcidStatesLab } from './AcidStatesLab';
import { WaitForGraphLab } from './WaitForGraphLab';
import { KeysFinderLab } from './KeysFinderLab';
import { DbCompassLab } from './DbCompassLab';
import { RelationalAlgebraLab } from './RelationalAlgebraLab';
import { GroupByHavingLab } from './GroupByHavingLab';
import { LostUpdateLab } from './LostUpdateLab';
import { TwoPhaseLockingLab } from './TwoPhaseLockingLab';
import { HashingLab } from './HashingLab';
import { AnalyticsLadderLab } from './AnalyticsLadderLab';
import { EncryptionReplicationLab } from './EncryptionReplicationLab';

interface LabDispatcherProps {
  labId: string;
}

export const LabDispatcher: React.FC<LabDispatcherProps> = ({ labId }) => {
  switch (labId) {
    case 'sql-playground':
      return <SqlPlaygroundLab />;
    case 'btree':
      return <BTreeLab />;
    case 'precedence-graph':
      return <PrecedenceGraphLab />;
    case 'normalization':
      return <NormalizationLab />;
    case 'join-viz':
      return <JoinVisualizerLab />;
    case 'recovery':
      return <RecoveryLab />;
    case 'ansi-sparc':
      return <AnsiSparcLab />;
    case 'er-mapper':
      return <ErMapperLab />;
    case 'raid':
      return <RaidLab />;
    case 'acid-states':
      return <AcidStatesLab />;
    case 'wait-for-graph':
      return <WaitForGraphLab />;
    case 'keys-finder':
      return <KeysFinderLab />;
    case 'db-compass':
      return <DbCompassLab />;
    case 'relational-algebra':
      return <RelationalAlgebraLab />;
    case 'groupby-having':
      return <GroupByHavingLab />;
    case 'lost-update':
      return <LostUpdateLab />;
    case 'two-phase-locking':
      return <TwoPhaseLockingLab />;
    case 'hashing':
      return <HashingLab />;
    case 'analytics-ladder':
      return <AnalyticsLadderLab />;
    case 'encryption-replication':
      return <EncryptionReplicationLab />;
    default:
      return <SqlPlaygroundLab />;
  }
};
