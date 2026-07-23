import { Ionicons } from "@expo/vector-icons";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";

import styles from "./styles";
import { useLocale, useTheme } from "../../store";
import { ShoppingItem } from "../../store/types";

export type ShoppingListItemProps = {
  item: ShoppingItem;
  isEditing: boolean;
  editingName: string;
  onToggle: () => void;
  onDelete: () => void;
  onStartEdit: () => void;
  onEditNameChange: (v: string) => void;
  onSaveEdit: () => void;
};

const ShoppingListItem = forwardRef<SwipeableMethods, ShoppingListItemProps>(
  (
    {
      item,
      isEditing,
      editingName,
      onToggle,
      onDelete,
      onStartEdit,
      onEditNameChange,
      onSaveEdit,
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const { t } = useLocale();
    const swipeableRef = useRef<SwipeableMethods>(null);

    useImperativeHandle(ref, () => ({
      close: () => swipeableRef.current?.close(),
      openLeft: () => swipeableRef.current?.openLeft(),
      openRight: () => swipeableRef.current?.openRight(),
      reset: () => swipeableRef.current?.reset(),
    }));

    const renderRightActions = useCallback(
      () => (
        <View style={styles.deleteAction}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel={`${t("delete")} ${item.name}`}
          >
            <Text style={styles.deleteText}>{t("delete")}</Text>
          </TouchableOpacity>
        </View>
      ),
      [onDelete, t, item.name],
    );

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        rightThreshold={40}
      >
        <View style={[styles.itemRow, { backgroundColor: theme.foreground }]}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              item.checked && {
                backgroundColor: theme.primary,
                borderColor: theme.primary,
              },
            ]}
            onPress={onToggle}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: item.checked }}
            accessibilityLabel={item.name}
          >
            {item.checked && (
              <Ionicons
                name="checkmark"
                size={13}
                color="white"
                accessibilityElementsHidden={true}
                importantForAccessibility="no"
              />
            )}
          </TouchableOpacity>

          {isEditing ? (
            <TextInput
              style={[styles.editInput, { color: theme.text }]}
              value={editingName}
              onChangeText={onEditNameChange}
              onBlur={onSaveEdit}
              onSubmitEditing={onSaveEdit}
              autoFocus
              returnKeyType="done"
              accessibilityLabel={t("modify")}
            />
          ) : (
            <TouchableOpacity
              onPress={onStartEdit}
              accessibilityRole="button"
              accessibilityLabel={`${t("modify")} ${item.name}`}
              style={{ flex: 1 }}
            >
              <Text
                style={[
                  styles.itemText,
                  { color: theme.text },
                  item.checked && styles.itemTextChecked,
                ]}
                numberOfLines={2}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Swipeable>
    );
  },
);

export default ShoppingListItem;
