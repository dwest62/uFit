import {useSelector} from 'react-redux'
import defaultProfilePicture from "../assets/profile.jpg"
import {convertMetersToInches, calculateBMI, convertMetersToFeetAndInches} from "../utils/conversionFunctions.js";

export default function Profile() {
	const user = useSelector((state) => state.user.user)

	const {feet, inches} = convertMetersToFeetAndInches(user.height)

	const myProfile = {
		picture: user.picture ? user.picture : defaultProfilePicture,
		username: user.username,
		uPoints : user.ufit_points,
		height: `${feet}' ${inches}"`,
		weight: `${user.weight} lbs.`,
		bmi: `${calculateBMI(user.weight, convertMetersToInches(user.height)).toFixed(2)}%`
	}

	return (
		<div className='page-contents-container'>
			<div className='page-contents'>
				<h1>Home</h1>
				<h3>My Info</h3>
			</div>
			<div className={"row"}>
				<div className="left w50">
					<div className="profile">
						<div className="left">
							<img alt={"My Picture"} src={myProfile.picture} style={{"borderRadius": "50px"}} width="100"/>

						</div>
						<div className="right">
							<div className="box">
								<div className="row header">
									{myProfile.username}
								</div>
								<div className="row">
									<div className="label">POINTS:</div>
									<div>{myProfile.uPoints}</div>
								</div>
								<div className="row">
									<div className="label">HEIGHT:</div>
									<div>{myProfile.height}</div>
								</div>
								<div className="row">
									<div className="label">WEIGHT:</div>
									<div>{myProfile.weight}</div>
								</div>
								<div className="row">
									<div className="label">BMI:</div>
									<div>{myProfile.bmi}</div>
								</div>
								<div className='row btn-row'>
									<a href="/profile-settings">Edit Profile</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}