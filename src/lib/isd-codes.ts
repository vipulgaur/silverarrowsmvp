export interface IsdCountryOption {
  code: string;
  country: string;
  iso: string;
  label: string;
}

export const DEFAULT_ISD_CODE = "+91";

export const ISD_COUNTRIES: IsdCountryOption[] = [
  { code: "+91", country: "India", iso: "IN", label: "{+91} - India" },
  { code: "+1", country: "United States / Canada", iso: "US", label: "{+1} - United States / Canada" },
  { code: "+44", country: "United Kingdom", iso: "GB", label: "{+44} - United Kingdom" },
  { code: "+45", country: "Denmark", iso: "DK", label: "{+45} - Denmark" },
  { code: "+971", country: "United Arab Emirates", iso: "AE", label: "{+971} - United Arab Emirates" },
  { code: "+61", country: "Australia", iso: "AU", label: "{+61} - Australia" },
  { code: "+65", country: "Singapore", iso: "SG", label: "{+65} - Singapore" },
  { code: "+49", country: "Germany", iso: "DE", label: "{+49} - Germany" },
  { code: "+33", country: "France", iso: "FR", label: "{+33} - France" },
  { code: "+46", country: "Sweden", iso: "SE", label: "{+46} - Sweden" },
  { code: "+47", country: "Norway", iso: "NO", label: "{+47} - Norway" },
  { code: "+358", country: "Finland", iso: "FI", label: "{+358} - Finland" },
  { code: "+31", country: "Netherlands", iso: "NL", label: "{+31} - Netherlands" },
  { code: "+41", country: "Switzerland", iso: "CH", label: "{+41} - Switzerland" },
  { code: "+34", country: "Spain", iso: "ES", label: "{+34} - Spain" },
  { code: "+39", country: "Italy", iso: "IT", label: "{+39} - Italy" },
  { code: "+43", country: "Austria", iso: "AT", label: "{+43} - Austria" },
  { code: "+32", country: "Belgium", iso: "BE", label: "{+32} - Belgium" },
  { code: "+353", country: "Ireland", iso: "IE", label: "{+353} - Ireland" },
  { code: "+351", country: "Portugal", iso: "PT", label: "{+351} - Portugal" },
  { code: "+30", country: "Greece", iso: "GR", label: "{+30} - Greece" },
  { code: "+48", country: "Poland", iso: "PL", label: "{+48} - Poland" },
  { code: "+420", country: "Czech Republic", iso: "CZ", label: "{+420} - Czech Republic" },
  { code: "+36", country: "Hungary", iso: "HU", label: "{+36} - Hungary" },
  { code: "+40", country: "Romania", iso: "RO", label: "{+40} - Romania" },
  { code: "+354", country: "Iceland", iso: "IS", label: "{+354} - Iceland" },
  { code: "+64", country: "New Zealand", iso: "NZ", label: "{+64} - New Zealand" },
  { code: "+81", country: "Japan", iso: "JP", label: "{+81} - Japan" },
  { code: "+82", country: "South Korea", iso: "KR", label: "{+82} - South Korea" },
  { code: "+86", country: "China", iso: "CN", label: "{+86} - China" },
  { code: "+852", country: "Hong Kong", iso: "HK", label: "{+852} - Hong Kong" },
  { code: "+886", country: "Taiwan", iso: "TW", label: "{+886} - Taiwan" },
  { code: "+60", country: "Malaysia", iso: "MY", label: "{+60} - Malaysia" },
  { code: "+66", country: "Thailand", iso: "TH", label: "{+66} - Thailand" },
  { code: "+62", country: "Indonesia", iso: "ID", label: "{+62} - Indonesia" },
  { code: "+63", country: "Philippines", iso: "PH", label: "{+63} - Philippines" },
  { code: "+84", country: "Vietnam", iso: "VN", label: "{+84} - Vietnam" },
  { code: "+94", country: "Sri Lanka", iso: "LK", label: "{+94} - Sri Lanka" },
  { code: "+977", country: "Nepal", iso: "NP", label: "{+977} - Nepal" },
  { code: "+880", country: "Bangladesh", iso: "BD", label: "{+880} - Bangladesh" },
  { code: "+92", country: "Pakistan", iso: "PK", label: "{+92} - Pakistan" },
  { code: "+960", country: "Maldives", iso: "MV", label: "{+960} - Maldives" },
  { code: "+975", country: "Bhutan", iso: "BT", label: "{+975} - Bhutan" },
  { code: "+966", country: "Saudi Arabia", iso: "SA", label: "{+966} - Saudi Arabia" },
  { code: "+974", country: "Qatar", iso: "QA", label: "{+974} - Qatar" },
  { code: "+968", country: "Oman", iso: "OM", label: "{+968} - Oman" },
  { code: "+965", country: "Kuwait", iso: "KW", label: "{+965} - Kuwait" },
  { code: "+973", country: "Bahrain", iso: "BH", label: "{+973} - Bahrain" },
  { code: "+972", country: "Israel", iso: "IL", label: "{+972} - Israel" },
  { code: "+90", country: "Turkey", iso: "TR", label: "{+90} - Turkey" },
  { code: "+20", country: "Egypt", iso: "EG", label: "{+20} - Egypt" },
  { code: "+27", country: "South Africa", iso: "ZA", label: "{+27} - South Africa" },
  { code: "+234", country: "Nigeria", iso: "NG", label: "{+234} - Nigeria" },
  { code: "+254", country: "Kenya", iso: "KE", label: "{+254} - Kenya" },
  { code: "+230", country: "Mauritius", iso: "MU", label: "{+230} - Mauritius" },
  { code: "+55", country: "Brazil", iso: "BR", label: "{+55} - Brazil" },
  { code: "+52", country: "Mexico", iso: "MX", label: "{+52} - Mexico" },
  { code: "+54", country: "Argentina", iso: "AR", label: "{+54} - Argentina" },
  { code: "+56", country: "Chile", iso: "CL", label: "{+56} - Chile" },
  { code: "+57", country: "Colombia", iso: "CO", label: "{+57} - Colombia" },
];

export const ACADEMY_EMAIL_DOMAIN = "flysilverarrows.com";
export const ACADEMY_EMAIL_SUFFIX = `@${ACADEMY_EMAIL_DOMAIN}`;

/**
 * Normalizes a raw username or email input into the local username part (before @).
 */
export function extractEmailUsername(input: string): string {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return "";
  if (trimmed.includes("@")) {
    return trimmed.split("@")[0]?.replace(/\s+/g, "") ?? "";
  }
  return trimmed.replace(/\s+/g, "");
}

/**
 * Builds the canonical `@flysilverarrows.com` email address from a username or full email string.
 */
export function formatAcademyEmail(usernameOrEmail: string): string {
  const username = extractEmailUsername(usernameOrEmail);
  if (!username) return "";
  return `${username}${ACADEMY_EMAIL_SUFFIX}`;
}

/**
 * Formats an ISD code and local mobile subscriber number into a single canonical phone string.
 */
export function formatPhoneWithIsd(isdCode: string, localPhone: string): string {
  const cleanLocal = localPhone.trim();
  if (!cleanLocal) return "";
  const code = isdCode.trim() || DEFAULT_ISD_CODE;
  // If user pasted a number that already starts with the ISD code, strip duplicate prefix
  const digitsOnlyLocal = cleanLocal.replace(/[^\d]/g, "");
  const codeDigits = code.replace(/[^\d]/g, "");
  if (cleanLocal.startsWith("+")) {
    if (cleanLocal.startsWith(code)) {
      const rest = cleanLocal.slice(code.length).trim();
      return rest ? `${code} ${rest}` : "";
    }
    return cleanLocal;
  }
  if (digitsOnlyLocal.length > 10 && digitsOnlyLocal.startsWith(codeDigits)) {
    const subscriber = digitsOnlyLocal.slice(codeDigits.length);
    return `${code} ${subscriber}`;
  }
  return `${code} ${cleanLocal}`;
}
