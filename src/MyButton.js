

function MyButton(props)
{
    return  (
        <div>
            <button style={{height:50,width:200}} onClick={props.onClick}>
                    {props.name}
            </button>
        </div>
    );
    
}

export default MyButton;