/**
 * Phone number formatting utilities.
 *
 * Filters are stored as raw local digits (e.g. "0752"). This module
 * converts them to a human-readable display form.
 */

/** Format a local digit string according to the country's convention. */
export function formatLocalNumber(digits: string, dialCode: string): string {
  if (!digits) return "";

  if (dialCode === "+33") {
    // French: groups of two from the start — 07 52 12 34 56
    return digits.match(/.{1,2}/g)?.join(" ") ?? digits;
  }

  if (dialCode === "+44") {
    // UK: first 5 digits, then up to 6 — 07777 777777
    if (digits.length <= 5) return digits;
    return digits.slice(0, 5) + " " + digits.slice(5);
  }

  return digits;
}

/**
 * Minimum local digits for a "complete" phone number.
 * Numbers shorter than this are treated as prefixes and shown with *.
 */
export function getMinLocalDigits(dialCode: string): number {
  const map: Record<string, number> = {
    "+33": 10,
    "+44": 11,
  };
  return map[dialCode] ?? 10;
}

/**
 * Format a filter entry for display.
 * Appends " *" when the filter is a prefix (shorter than a complete number).
 */
export function formatFilterLabel(filter: string, dialCode: string): string {
  const formatted = formatLocalNumber(filter, dialCode);
  const isPrefix = filter.replace(/\s/g, "").length < getMinLocalDigits(dialCode);
  const suffix = isPrefix ? " *" : "";
  return dialCode ? `${dialCode} ${formatted}${suffix}` : `${formatted}${suffix}`;
}

/**
 * Format a full phone number for display in the call log.
 * Handles E.164 international format and domestic numbers.
 */
export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return phoneNumber;

  // E.164 or international with +
  if (phoneNumber.startsWith("+33")) {
    const national = "0" + phoneNumber.slice(3);
    return "+33 " + formatLocalNumber(national, "+33");
  }
  if (phoneNumber.startsWith("+44")) {
    const national = "0" + phoneNumber.slice(3);
    return "+44 " + formatLocalNumber(national, "+44");
  }

  // Domestic French 10-digit number
  if (/^0\d{9}$/.test(phoneNumber)) {
    return formatLocalNumber(phoneNumber, "+33");
  }

  return phoneNumber;
}
