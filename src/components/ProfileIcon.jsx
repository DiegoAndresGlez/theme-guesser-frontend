import profileIconUrl from '../assets/img/profile-icon.png?url'

const ProfileIcon = ({
    size = 48,
    label,
    className = '',
    ...props
}) => {
    return (
        <img
            src={profileIconUrl}
            className={className}
            style={{ 
                width: size,
                height: size,
                objectFit: 'contain'
            }}
            alt={label || ""}
            role="img"
            {...props}
        />
    );
};

export default ProfileIcon;