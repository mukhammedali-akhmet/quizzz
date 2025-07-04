
const Quiz = ({
    coverURL,
    title,
    username
}: {
    coverURL: string,
    title: string,
    username?: string
}) => {
    return (
        <div>
            <img src={coverURL} alt={title} />
            <h3>{title}</h3>
            {username && <p>By {username}</p>}
        </div>
    )
}

export default Quiz