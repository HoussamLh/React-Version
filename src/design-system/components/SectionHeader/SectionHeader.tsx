import React from "react";
import { Label } from "../Label";
import { 
  AccentText, 
  Heading, 
  Text 
} from "../Typography";

type SectionHeaderProps = {
  badgeText: React.ReactNode;

  title?: React.ReactNode;
  titleAccent?: React.ReactNode;
  subtitle?: React.ReactNode;

  /** Use customTitle only when custom content is needed.*/
  customTitle?: React.ReactNode;

  /** Use customHeading when the heading needs a custom structure.*/
  customHeading?: React.ReactNode;

  headingAs?: "h1" | "h2" | "h3";

  containerStyle?: React.CSSProperties;
  textWrapperStyle?: React.CSSProperties;
  badgeStyle?: React.CSSProperties;
  headingStyle?: React.CSSProperties;
  accentStyle?: React.CSSProperties;
  subtitleStyle?: React.CSSProperties;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badgeText,
  title,
  titleAccent,
  subtitle,
  customTitle,
  customHeading,
  headingAs = "h2",
  containerStyle,
  textWrapperStyle,
  badgeStyle,
  headingStyle,
  accentStyle,
  subtitleStyle,
}) => {
  return (
    <div style={{ ...styles.container, ...containerStyle }}>
      <div style={{ ...styles.textWrapper, ...textWrapperStyle }}>
        <Label text={badgeText} badgeStyle={badgeStyle} />

        {customHeading || (
          <Heading as={headingAs} variant="section" 
          style={headingStyle}>
            {customTitle || (
              <>
                {title}
                {titleAccent && (
                  <>
                    {" "}
                    <AccentText style={accentStyle}>
                      {titleAccent}</AccentText>
                  </>
                )}
              </>
            )}
          </Heading>
        )}

        {subtitle && (
          <Text variant="section" style={subtitleStyle}>
            {subtitle}
          </Text>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
  },

  textWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    textAlign: "left" as const,
  },
};
