import { AppShell } from '@/components/common/app-shell';

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
