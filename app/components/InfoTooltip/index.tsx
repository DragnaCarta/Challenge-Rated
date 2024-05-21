import { IconInfo } from '@/app/ui/icons/IconInfo'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/ui/tooltip'

export const InfoTooltip = () => (
  <Tooltip placement="top-end">
    <TooltipTrigger>
      <IconInfo width={16} height={16} />
    </TooltipTrigger>
    <TooltipContent>
      <div className="bg-info p-4 max-w-80 text-info-content rounded-lg">
        This is the approximate percentage of their daily spell slots, hit dice,
        magic item charges, and other expendable resources your players will
        likely spend during this encounter.
      </div>
    </TooltipContent>
  </Tooltip>
)
