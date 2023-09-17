import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, FlatList } from 'react-native';

const CustomDropdown = ({ options, selectedOption, onSelect }) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleModal = () => {
        setIsVisible(!isVisible);
    };

    const handleSelect = (option) => {
        onSelect(option);
        toggleModal();
    };

    return (
        <View>
            <TouchableOpacity onPress={toggleModal}>
                <Text>{selectedOption ? selectedOption.label : 'Select an option'}</Text>
            </TouchableOpacity>

            <Modal visible={isVisible} animationType="slide">
                <View>
                    <FlatList
                        data={options}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelect(item)}>
                                <Text>{item.label} kll</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.value}
                    />
                    <TouchableOpacity onPress={toggleModal}>
                        <Text>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

export default CustomDropdown;
