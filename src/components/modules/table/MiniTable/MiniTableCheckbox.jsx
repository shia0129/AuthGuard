import IndeterminateCheckbox from '../IndeterminateCheckbox';

function MiniTableCheckbox({ list, data, index, onChange }) {
  return list.map(
    (item, dIndex) =>
      index === dIndex &&
      item !== undefined && (
        <IndeterminateCheckbox
          key={dIndex}
          checked={item}
          sx={{ padding: '5px 8px' }}
          onChange={(event) => onChange(event, data)}
        />
      ),
  );
}

export default MiniTableCheckbox;
