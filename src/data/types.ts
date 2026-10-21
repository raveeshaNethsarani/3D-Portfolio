// Types shared by more than one section's data.

// A line of a large display headline: solid ink, outlined, or pink.
export type TitleStyle = "solid" | "outline" | "accent";
export type TitleLine = { text: string; style?: TitleStyle };
