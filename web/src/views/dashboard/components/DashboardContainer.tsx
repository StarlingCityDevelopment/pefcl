// web/src/views/dashboard/components/DashboardContainer.tsx
import Button from "@ui/Button";
import { Typography } from "@ui/Typography";
import { cn } from "@utils/cn";
import { Loader2 } from 'lucide-solid';
import { type ParentProps, Show } from 'solid-js';
import i18n from "@utils/i18n";
import { useNavigate } from "@solidjs/router";

interface DashboardContainerProps extends ParentProps {
  title: string;
  total: () => number;
  viewAllRoute: string;
}

const DashboardContainer = (props: DashboardContainerProps) => {
  const navigate = useNavigate();

  return (
    <div class='flex flex-col gap-4 p-5 bg-bg-panel border border-border-main h-full shadow-premium'>
      <header class='flex flex-row justify-between items-center pb-3 border-b border-border-main'>
        <div class='flex items-center gap-3'>
          <Typography variant='h4' class='text-fg-main font-display font-black tracking-tight text-xs'>
            {props.title}
          </Typography>
          <div class='flex items-center justify-center h-5 px-2 bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary font-mono'>
            {props.total()}
          </div>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => navigate(props.viewAllRoute)}
          class='h-6 px-3 text-[9px] font-bold uppercase tracking-[0.15em]'
        >
          {i18n.t('View all')}
        </Button>
      </header>

      <div class='flex-1 max-h-[26rem] overflow-y-auto pr-1 custom-scrollbar relative'>
        <div class='flex flex-col gap-1.5'>{props.children}</div>
      </div>
    </div>
  );
};

export const DashboardContainerFallback = (props: { title: string }) => {
  return (
    <div class='flex flex-col gap-4 p-6 bg-bg-panel border border-border-main h-full'>
      <header class='flex flex-row justify-between items-center'>
        <Typography variant='pre' class='text-text-muted font-bold uppercase tracking-[0.15em]'>
          {props.title}
        </Typography>
      </header>
      <div class='flex-1 flex items-center justify-center p-16'>
        <Loader2 size={24} class='animate-spin text-primary opacity-60' />
      </div>
    </div>
  );
};

export default DashboardContainer;
