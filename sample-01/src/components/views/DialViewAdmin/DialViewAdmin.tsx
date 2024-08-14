import styled from 'styled-components';
import type { DirectCallOption } from 'sendbird-calls';

import { AudioDialButton } from 'components/atoms/CallButtons';
import { useSbCalls } from 'lib/sendbird-calls';
import * as fonts from 'styles/fonts';
import * as mixins from 'styles/mixins';
import { media } from 'utils';

const Wrapper = styled.div`

`;

const FormContainer = styled.div`
  ${mixins.flexCenter};
  width: 312px;
  flex-direction: column;
  box-sizing: border-box;
  border: none;
`;

const Title = styled.div`
  ${fonts.big};
  ${fonts.demi};
  margin-bottom: 16px;
  color: var(--white);
`;

const ButtonsGroup = styled.div`
  ${mixins.flexCenter};
  margin-top: 16px;
`;

function getCallOption(callOption?: DirectCallOption) {
  return {
    localMediaView: undefined,
    remoteMediaView: undefined,
    videoEnabled: true,
    audioEnabled: true,
    ...callOption,
  };
}


interface DialViewAdminProps {}
const DialViewAdmin: React.FC<DialViewAdminProps> = props => {
  const sbCall = useSbCalls();
  const userId = "PaperclipBezoeker";
  const dial = (isVideoCall: boolean) => {
    sbCall.dial({ userId, isVideoCall, callOption: getCallOption({}) });
  };

  return (
    <Wrapper>
      <FormContainer>
        <Title className="">Make a call</Title>
        <ButtonsGroup>
          <AudioDialButton onClick={() => dial(false)} />
        </ButtonsGroup>
      </FormContainer>
    </Wrapper>
  );
};

export default DialViewAdmin;
