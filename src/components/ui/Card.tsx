import styled from "styled-components";

export const Card = styled.div`
  background-color: ${(props): string =>
    props.theme.background.secondary};
  border-radius: 5px;
  overflow: hidden;
  flex: 1;
  flex-direction: column;
`;

export const CardPadding = styled.div`
  padding: 1.5rem;
`;

export const CardHeader = styled.div<{ align?: string }>`
  vertical-align: center;
  display: inline-flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: ${(
    props
): string => props.align || "left"};
`;

export const CardSection = styled.div`
  flex: 1;
  padding-top: 1rem;
  display: block;
  word-break: break-word;
`;

export const CardFlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin: 1.5rem;
  ${Card} {
    flex: 0 28%;
    margin: 5px;
    @media screen and (max-width: 1000px) {
      flex: 1 100%;
    }
  }
`;
