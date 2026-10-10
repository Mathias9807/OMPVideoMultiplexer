export async function publishStream(stream: MediaStream, whipUrl: string): Promise<RTCPeerConnection> {
    const pc = new RTCPeerConnection();

    for (const track of stream.getTracks()) {
        pc.addTrack(track, stream);
    }

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Wait for ICE gathering to finish so the SDP
    // contains the candidates.
    await new Promise<void>(resolve => {
        if (pc.iceGatheringState === "complete") {
            resolve();
            return;
        }

        pc.addEventListener("icegatheringstatechange", () => {
            if (pc.iceGatheringState === "complete") {
                resolve();
            }
        });
    });

    const response = await fetch(whipUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/sdp"
        },
        body: pc.localDescription?.sdp
    });

    if (!response.ok) {
        pc.close();
        throw new Error(`WHIP failed: ${response.status} ${await response.text()}`);
    }

    const answer = await response.text();

    await pc.setRemoteDescription({
        type: "answer",
        sdp: answer
    });

    return pc;
}

export async function askShareScreen() {
  const displayMediaOpt: any = {
    video: {
      displaySurface: 'browser',
    },
    audio: {
      suppressLocalAudioPlayback: false,
    },
    preferCurrentTab: false,
    selfBrowserSurface: 'exclude',
    systemAudio: 'include',
    surfaceSwitching: 'include',
    monitorTypeSurfaces: 'include',
  };
  const capture = await navigator.mediaDevices.getDisplayMedia(displayMediaOpt);

  const rtc = await publishStream(capture, `https://${import.meta.env.VITE_OME_HOST}/app/webrtc?direction=whip`);
  console.log(rtc);
}
