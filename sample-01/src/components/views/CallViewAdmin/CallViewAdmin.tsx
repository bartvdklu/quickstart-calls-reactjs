import { useCallback } from 'react';
import styled, { css } from 'styled-components';

import {
  AudioCallAcceptButton,
  MuteButton, UnmuteButton, EndButton,
} from 'components/atoms/CallButtons';
import { CallingText, RingingText } from 'components/atoms/CallTexts';
import Screen from 'components/templates/Screen';
import { useSbCalls } from 'lib/sendbird-calls';
import type { StatefulDirectCall } from 'lib/sendbird-calls';
import * as fonts from 'styles/fonts';
import * as mixins from 'styles/mixins';
import { isSafari, media } from 'utils';

const Wrapper = styled(Screen)`
 ${mixins.flexCenter};
 flex-direction: column;
 position: absolute;
 top: 0;
 left: 0;
 z-index: 1; // TODO: Temporary z-index because of menu dropdown coming upfront
 color: white;
 background-color: var(--navy-900);
`;

const Background = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  border-radius: 8px;
  ${media.main} {
    border-radius: 0;
  }
`;

const Foreground = styled.div`
  ${mixins.flexCenter};
  position: relative;
  flex-direction: column;
`;

const PeerProfile = styled.img`
  display: block;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: contain;
  margin-bottom: 24px;
`;
const PeerName = styled.div`
  ${fonts.big};
  ${fonts.demi};
  min-height: 32px;
  height: auto;
  text-align: center;
  word-break: break-all;
  margin-bottom: 4px;
`;

const ConnectionInfo = styled.div`
  ${fonts.normal};
  color: var(--white);
  height: 20px;
  margin-bottom: 24px;
`;

const PeerState = styled.div`
  ${mixins.flexColumn};
  align-items: center;
  margin-bottom: 97px;
`;

const PeerMuteIcon = styled.div`
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
  background-image: url(/icons/ic-callkit-audio-off-white.svg);
  background-repeat: no-repeat;
  background-position: center;
`;

const PeerMuteLabel = styled.div`
  ${fonts.small};
  display: block;
  color: var(--white);
`;

type MediaViewSize = 'hidden' | 'small' | 'full';
const getVideoStyleFromSize = (size: MediaViewSize) => {
  switch (size) {
    case 'hidden':
      return css`
          opacity: 0;
          transition: all 0.5s;
          display: none;
        `;
    case 'small':
      return css`
          position: absolute;
          top: 16px;
          left: 16px;
          width: 200px;
          height: 150px;
          border-radius: 8px;
          background-color: var(--navy-300);
        `;
    case 'full':
      return css`
          position: absolute;
          width: 100%;
          height: 100%;
          transition: all 1s;
        `;
    default:
      return '';
  }
};

const Controls = styled.div`
  ${mixins.flexCenter};
  position: absolute;
  bottom: 40px;
  ${media.main} {
    position: relative;
  }
`;

interface CallViewAdminProps { call: StatefulDirectCall; }
const CallViewAdmin: React.FC<CallViewAdminProps> = ({ call }) => {
  const { clearCalls } = useSbCalls();
  const {
    callState,
    remoteUser,
    isLocalAudioEnabled,
    isRemoteAudioEnabled,
    localMediaView,
    remoteMediaView,
  } = call;

  const accept = useCallback(() => {
    call.accept({
      callOption: {
        localMediaView,
        remoteMediaView,
        audioEnabled: true,
        videoEnabled: true,
      },
    });
  }, [localMediaView, remoteMediaView]);

  let localMediaViewSize: MediaViewSize;
  let remoteMediaViewSize: MediaViewSize;

  const remoteMediaViewRef = useCallback(node => {
    call.setRemoteMediaView(node);
  }, []);

  const localMediaViewRef = useCallback(node => {
    call.setLocalMediaView(node);
  }, []);


  switch (callState) {
    case 'dialing':
    case 'ringing':
      localMediaViewSize = 'full';
      remoteMediaViewSize = 'hidden';
      break;
    case 'connected':
    case 'reconnecting':
      localMediaViewSize = 'small';
      remoteMediaViewSize = 'full';
      break;
    case 'ended':
    default:
      localMediaViewSize = 'hidden';
      remoteMediaViewSize = 'hidden';
  }

  const is = useCallback((...states) => states.some(state => state === callState), [callState]);
  const isNot = useCallback((...states) => !states.some(state => state === callState), [callState]);
  const connectedStates = ['established', 'connected', 'reconnecting', 'reconnected'];

  return (
    <Wrapper>
      <Background>
        <audio
          ref={localMediaViewRef}
          playsInline
          autoPlay
          muted
        />
        <audio
          ref={remoteMediaViewRef}
          playsInline
          autoPlay
          muted={false}
          controls={isSafari()}
        />
      </Background>
      <Foreground>
        {
          remoteUser.profileUrl && <PeerProfile src={remoteUser.profileUrl || ''} alt="Sendbird voice & video call opponent profile photo" />
        }
        <PeerName>{remoteUser.nickname || remoteUser.userId}</PeerName>
        {
          isNot(...connectedStates)
          && (
            <ConnectionInfo>
              {is('dialing') && <CallingText />}
              {is('ringing') && <RingingText isVideoCall={call.isVideoCall} />}
              {is('ended') && <>{call.endResult}</>}
            </ConnectionInfo>
          )
        }
        <PeerState>
          {
            is(...connectedStates) && !isRemoteAudioEnabled && (
              <>
                <PeerMuteIcon />
                <PeerMuteLabel>
                  {remoteUser.userId} audio muted this call
                </PeerMuteLabel>
              </>
            )
          }
        </PeerState>

        <Controls>
          {
            isNot('ended') && ([
              isLocalAudioEnabled
                ? <MuteButton key="mute-audio" onClick={() => call.muteMicrophone()} />
                : <UnmuteButton key="unmute-audio" onClick={() => call.unmuteMicrophone()} />,
            ])
          }
          {
            is('ringing')
            && 
              <AudioCallAcceptButton onClick={accept} />
            
          }
          {
            isNot('ended')
            && <EndButton onClick={() => call.end()} />
          }
          {
            is('ended')
            && clearCalls()
          }
        </Controls>
      </Foreground>
    </Wrapper>
  );
};

export default CallViewAdmin;
