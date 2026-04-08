import type { CrapsBet, CrapsBetType } from '../../../types/craps';
import { CRAPS_PAYOUT_TABLE } from '../../../types/craps';
import { CrapsBetZone } from './CrapsBetZone';

interface CrapsTableProps {
  activeBets: CrapsBet[];
  onPlaceBet: (type: CrapsBetType) => void;
  showBeginnerLayout: boolean;
  point: number | null;
  chipAmount: number;
  availableBets: CrapsBetType[];
}

interface BetZoneConfig {
  type: CrapsBetType;
  label: string;
  payout: string;
}

const smartBets: BetZoneConfig[] = [
  { type: 'pass', label: 'Pass Line', payout: '1:1' },
  { type: 'dontPass', label: "Don't Pass", payout: '1:1' },
  { type: 'come', label: 'Come', payout: '1:1' },
  { type: 'dontCome', label: "Don't Come", payout: '1:1' },
  { type: 'passOdds', label: 'Pass Odds', payout: 'True odds' },
  { type: 'dontPassOdds', label: "Don't Pass Odds", payout: 'True odds' },
  { type: 'comeOdds', label: 'Come Odds', payout: 'True odds' },
  { type: 'dontComeOdds', label: "Don't Come Odds", payout: 'True odds' },
  { type: 'place6', label: 'Place 6', payout: '7:6' },
  { type: 'place8', label: 'Place 8', payout: '7:6' },
];

const standardBets: BetZoneConfig[] = [
  { type: 'place5', label: 'Place 5', payout: '7:5' },
  { type: 'place9', label: 'Place 9', payout: '7:5' },
  { type: 'place4', label: 'Place 4', payout: '9:5' },
  { type: 'place10', label: 'Place 10', payout: '9:5' },
  { type: 'field', label: 'Field', payout: '1:1 / 2:1' },
];

const suckerBets: BetZoneConfig[] = [
  { type: 'big6', label: 'Big 6', payout: '1:1' },
  { type: 'big8', label: 'Big 8', payout: '1:1' },
  { type: 'hardway4', label: 'Hard 4', payout: '7:1' },
  { type: 'hardway6', label: 'Hard 6', payout: '9:1' },
  { type: 'hardway8', label: 'Hard 8', payout: '9:1' },
  { type: 'hardway10', label: 'Hard 10', payout: '7:1' },
  { type: 'anySeven', label: 'Any Seven', payout: '4:1' },
  { type: 'anyCraps', label: 'Any Craps', payout: '7:1' },
  { type: 'eleven', label: 'Yo (11)', payout: '15:1' },
  { type: 'aceDeuce', label: 'Ace-Deuce (3)', payout: '15:1' },
  { type: 'aces', label: 'Aces (2)', payout: '30:1' },
  { type: 'boxcars', label: 'Boxcars (12)', payout: '30:1' },
  { type: 'horn', label: 'Horn', payout: 'varies' },
  { type: 'hornHigh', label: 'Horn High', payout: 'varies' },
];

function BetGroup({
  title,
  titleColor,
  bets,
  activeBets,
  onPlaceBet,
  availableBets,
  dimmed,
}: {
  title: string;
  titleColor: string;
  bets: BetZoneConfig[];
  activeBets: CrapsBet[];
  onPlaceBet: (type: CrapsBetType) => void;
  availableBets: CrapsBetType[];
  dimmed: boolean;
}) {
  return (
    <div>
      <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${titleColor}`}>
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-1.5">
        {bets.map((zone) => {
          const activeBet = activeBets.find((b) => b.type === zone.type);
          const isAvailable = availableBets.includes(zone.type);
          return (
            <CrapsBetZone
              key={zone.type}
              betType={zone.type}
              label={zone.label}
              payout={zone.payout}
              isActive={!!activeBet}
              chipAmount={activeBet?.amount ?? 0}
              dimmed={dimmed || !isAvailable}
              onClick={() => onPlaceBet(zone.type)}
            />
          );
        })}
      </div>
    </div>
  );
}

// Desktop: wider grid layout resembling a table
function DesktopTable(props: CrapsTableProps) {
  const { activeBets, onPlaceBet, showBeginnerLayout, availableBets } = props;

  return (
    <div className="hidden md:block bg-felt-dark/50 rounded-2xl p-5 border border-cream/10">
      {/* Numbers bar */}
      <div className="grid grid-cols-6 gap-1.5 mb-4">
        {(['place4', 'place5', 'place6', 'place8', 'place9', 'place10'] as CrapsBetType[]).map(
          (type) => {
            const num = type.replace('place', '');
            const info = CRAPS_PAYOUT_TABLE[type];
            const activeBet = activeBets.find((b) => b.type === type);
            return (
              <CrapsBetZone
                key={type}
                betType={type}
                label={num}
                payout={info.paysRatio}
                isActive={!!activeBet}
                chipAmount={activeBet?.amount ?? 0}
                dimmed={!availableBets.includes(type)}
                onClick={() => onPlaceBet(type)}
              />
            );
          }
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left: Contract bets */}
        <div className="space-y-3">
          <BetGroup
            title="Smart Bets"
            titleColor="text-green-400"
            bets={smartBets.filter((b) => !b.type.startsWith('place'))}
            activeBets={activeBets}
            onPlaceBet={onPlaceBet}
            availableBets={availableBets}
            dimmed={false}
          />
        </div>

        {/* Center: Field & Standard */}
        <div className="space-y-3">
          <BetGroup
            title="Standard"
            titleColor="text-yellow-400"
            bets={standardBets.filter((b) => !b.type.startsWith('place'))}
            activeBets={activeBets}
            onPlaceBet={onPlaceBet}
            availableBets={availableBets}
            dimmed={false}
          />
        </div>

        {/* Right: Sucker bets */}
        {!showBeginnerLayout && (
          <div className="space-y-3">
            <BetGroup
              title="Sucker Bets"
              titleColor="text-red-400"
              bets={suckerBets}
              activeBets={activeBets}
              onPlaceBet={onPlaceBet}
              availableBets={availableBets}
              dimmed={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Mobile: card-based vertical layout
function MobileTable(props: CrapsTableProps) {
  const { activeBets, onPlaceBet, showBeginnerLayout, availableBets } = props;

  return (
    <div className="md:hidden space-y-4 bg-felt-dark/50 rounded-2xl p-4 border border-cream/10">
      <BetGroup
        title="Smart Bets"
        titleColor="text-green-400"
        bets={smartBets}
        activeBets={activeBets}
        onPlaceBet={onPlaceBet}
        availableBets={availableBets}
        dimmed={false}
      />

      <BetGroup
        title="Standard"
        titleColor="text-yellow-400"
        bets={standardBets}
        activeBets={activeBets}
        onPlaceBet={onPlaceBet}
        availableBets={availableBets}
        dimmed={false}
      />

      {!showBeginnerLayout && (
        <BetGroup
          title="Sucker Bets"
          titleColor="text-red-400"
          bets={suckerBets}
          activeBets={activeBets}
          onPlaceBet={onPlaceBet}
          availableBets={availableBets}
          dimmed={false}
        />
      )}
    </div>
  );
}

export function CrapsTable(props: CrapsTableProps) {
  return (
    <>
      <MobileTable {...props} />
      <DesktopTable {...props} />
    </>
  );
}
