// Project import
import GridItem from '@components/modules/grid/GridItem';
import MainCard from '@components/mantis/MainCard';
import PropTypes from 'prop-types';

/**
 *
 * @param {Function} onSearch 검색 시 실행 할 함수
 * @param {Node} children 상세 검색 내에 포함 될 자식 컴포넌트
 */
function SearchInput({ children, onSearch, positionUnset = false }) {
  return (
    <>
      {children && (
        <GridItem item>
          <MainCard
            sx={{
              ...(positionUnset && { position: 'unset' }),
              background: 'rgba(184, 196, 255, 0.17)',
            }}
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                e.target.className.includes('MuiInputBase-input') &&
                !e.target.className.includes('MuiSelect-select') &&
                onSearch
              )
                onSearch();
            }}
          >
            {children}
          </MainCard>
        </GridItem>
      )}
    </>
  );
}

SearchInput.propTypes = {
  /**
   * 자식 컴포넌트.
   */
  children: PropTypes.any,
  /**
   * 상세 검색 Callback 함수.
   */
  onSearch: PropTypes.func,
};

export default SearchInput;
