import * as FaIcons from 'react-icons/fa';
import * as GiIcons from 'react-icons/gi';
import * as IoIcons from 'react-icons/io';

const IconMapper = ({ iconName, ...props }) => {
    const iconLibraries = {
        Fa: FaIcons,
        Gi: GiIcons,
        Io: IoIcons
    };

    const [prefix] = iconName.split(/(?=[A-Z])/);
    const IconComponent = iconLibraries[prefix]?.[iconName];

    return IconComponent ? <IconComponent {...props} /> : <FaIcons.FaQuestionCircle {...props} />;
};

export default IconMapper;