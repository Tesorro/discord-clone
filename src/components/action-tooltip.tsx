'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ALIGN_OPTIONS, SIDE_OPTIONS } from '@radix-ui/react-popper';

type Side = (typeof SIDE_OPTIONS)[number];
type Align = (typeof ALIGN_OPTIONS)[number];
interface ActionTooltipProps {
  label: string;
  children: React.ReactNode;
  side: Side;
  align: Align;
}
export const ActionTooltip = ({
  children,
  side,
  align,
  label,
}: ActionTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className={'font-semibold text-sm capitalize'}>
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
