const socket = io('/');
const videoGride = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '6060'
});



let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    })
    let text = $('input')
    $('html').keydown((e) => {
        if (e.which == 13 && text.val().length !== 0) {
            // console.log(text.val());
            socket.emit('message', text.val());
            text.val('');
        }
    });
    socket.on('createMessage', message => {
        $('ul').append(`<li class="message"><b>User</b><br/>${message}</li>`);
        scrollToBottom()
    })
})
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})



const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGride.append(video);
}

const scrollToBottom = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

//Mute our video

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteBotton();
    }
    else {
        setMuteBotton();
        myVideoStream.getAudioTracks()[0].enabled = true;

    }
}
const setMuteBotton = () => {
    const html = `
    <i class='fas fa-microphone'></i>
    <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}
const setUnmuteBotton = () => {
    const html = `
     <i class=' unmute fas fa-microphone-slash'></i>
    <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    } else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}
const setPlayVideo = () => {
    const html=`
    <i class=" videostop fas fa-video-slash"></i>
    <span>Play Video</span>`
    document.querySelector('.main__stop_button').innerHTML = html;
}
const setStopVideo = () => {
    const html=`
    <i class="fas fa-video"></i>
    <span>Stop Video</span>`
    document.querySelector('.main__stop_button').innerHTML = html;
}