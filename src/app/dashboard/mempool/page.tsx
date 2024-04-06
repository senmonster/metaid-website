import MempoolContent from '@/components/Dashboard/MempoolContent';
import { PageContainer } from '@/components/PageContainer/PageContainer';

export default function Dashboard() {
  return (
    <PageContainer title='Mempool Pin List'>
      <MempoolContent />
    </PageContainer>
  );
}
