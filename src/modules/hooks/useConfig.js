import { useContext } from 'react';
import { ConfigContext } from '@modules/contexts/ConfigContext';

// ==============================|| CONFIG - HOOKS  ||============================== //

const useConfig = () => useContext(ConfigContext);

export default useConfig;
