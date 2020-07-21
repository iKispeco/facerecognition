import React from 'react';
import './faceRecognition.css';

const FaceRecognition = ({ imageUrl, faceBox }) => {
	return(
		<div className='center ma'>
			<div className='absolute mt2'>
				<img id='imageinput' alt='' src={imageUrl} width='500px' height='auto' />
				<div className='imageBox' style={{top: faceBox.topRow, left: faceBox.leftCol, right: faceBox.rightCol, bottom: faceBox.bottomRow}}> </div>
			</div>
		</div>
		);

}

export default FaceRecognition;