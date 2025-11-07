import picture from './assets/profile.png';
function Card() {
    return (
        <div> 
            <img src={picture} alt = "Card Image" />
            <h2> Events Details </h2>
        </div>
    )
}
export default Card;
