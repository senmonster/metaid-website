import PinContent from "@/components/Dashboard/PinContent";
import { PageContainer } from "@/components/PageContainer/PageContainer";
import PinDetail from "@/components/PinDetail";

export default function DashboardPinDetail({ params: { slug } }: { params: { slug: string } }) {
	return (
		<PageContainer title="PinDetail">
			<PinDetail id={slug} />
		</PageContainer>
	);
}
