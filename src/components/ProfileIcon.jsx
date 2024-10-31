import ProfileIconSVG from '../assets/img/profile-icon.svg'

const ProfileIcon = ({
    size = 28,
    label,
    ...props
}) => {
    return (
        <div 
            className='bg-accent'
            style={{ 
                WebkitMask: `url(${ProfileIconSVG}) no-repeat center`,
                mask: `url(${ProfileIconSVG}) no-repeat center`,
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                width: size,
                height: size,
            }}
            role="img"
            aria-hidden={!label}
            aria-label={label || ""}
            {...props}
        />
    );
};
 
export default ProfileIcon;