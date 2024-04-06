export interface NavItem {
  label: string;
  link?: string;

  links?: { label: string; link: string }[];
}
