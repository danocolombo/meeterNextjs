import { IconType } from 'react-icons';
import { SiFormstack } from 'react-icons/si';
import { GiPodiumWinner } from 'react-icons/gi';
import { LuPartyPopper } from 'react-icons/lu';

type Type = {
    label: TypeLabel;
    icon: IconType;
};

export type TypeLabel = 'testimony' | 'lesson' | 'special';

// the following label values are from TypeList above
export const meetingTypes: Type[] = [
    {
        label: 'testimony',
        icon: GiPodiumWinner,
    },
    {
        label: 'lesson',
        icon: SiFormstack,
    },
    {
        label: 'special',
        icon: LuPartyPopper,
    },
];
