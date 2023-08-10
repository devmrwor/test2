import { usePathname, useRouter } from "next/navigation";
import SegmentControl from "./SegmentControl";

const ClientAgentLink = (props: { data: { label: string; value: string }[] }) => {
  const router = useRouter();
  const navigation = usePathname();

  const searchURL = navigation === props.data[0].value ? props.data[0].value : props.data[1].value;

  return (
    <SegmentControl
      // fullWidth
      onChange={(value) => router.push(value)}
      value={searchURL}
      data={props.data}
    />
  );
};

export default ClientAgentLink;
