import { Image} from 'react-native';
let url = 'adaptive-icon.png';
let title = '';
<Image source={require('./assets/event-image.png')} style={{ width: 200, height: 200 }} />
import React from 'react';

function EventsDetails() {
    return (
        <>
            <img src ={url} alt = "Event Details"> 
            </img>
            <h1> {title} </h1>
        </>
        
    )
}
