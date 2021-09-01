import styled from 'styled-components';
import { device } from '../device';
import { transition } from '../stories/styled';

const Wrapper = styled.div`
  align-items: start;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;
`;

const Info = styled.div`
  font-size: 11px;
  text-transform: uppercase;
`;

const InfoLabel = styled.span`
  color: ${(props): string => props.theme.topBar.textColor};
`;

const InfoText = styled.span`
  font-size: 13px;

  &.start-day,
  &.end-day {
    font-weight: bold;
  }
`;

const Text = styled.div``;

const CloseButton = styled.button`
  background-color: ${(props): string =>
    props.theme.topBar.closeButton.backgroundColor.base};
  border-radius: 4px;
  border: none;
  box-shadow: none;
  cursor: pointer;
  font-size: 10px;
  color: ${(props): string => props.theme.topBar.closeButton.textColor.base};
  padding: 7px 13px;
  text-decoration: none;
  text-shadow: none;
  text-transform: uppercase;
  ${transition}

  &:hover {
    background-color: ${(props): string =>
      props.theme.topBar.closeButton.backgroundColor.hover};
    color: ${(props): string => props.theme.topBar.closeButton.textColor.hover};
  }

  @media only screen and ${device.mobileL} {
    margin-top: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
`;

export { CloseButton, Info, InfoLabel, InfoText, Text, Wrapper };
