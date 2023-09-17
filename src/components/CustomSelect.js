import React, { useState } from 'react';
import { View, Text } from 'react-native';
import CustomDropdown from './CustomDropdown'; // Import the custom dropdown component

export default function CustomSelect({ list, handleSelectChange, title }) {
  const [selectedOption, setSelectedOption] = useState(null); // Track the selected option

  return (
      <View style={{ flexDirection: 'column', marginBottom: 20 }}>
        <Text style={{ color: 'orange', fontWeight: 'bold' }}>{title}</Text>

        <CustomDropdown
            options={list}
            selectedOption={selectedOption}
            onSelect={(option) => {
              setSelectedOption(option); // Update the selected option
              handleSelectChange(option.value); // Call the provided change handler
            }}
        />
      </View>
  );
}
