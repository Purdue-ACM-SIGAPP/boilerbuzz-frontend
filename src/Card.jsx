import picture from '../public/image.jpg';
function Card() {
    return (
        <div> 
            <img src={picture} at = "Card Image" />
            <h2> Events Details </h2>
        </div>
    )
}
export default Card;
