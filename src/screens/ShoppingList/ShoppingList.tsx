import ShoppingListItem from "@components/ShoppingListItem/ShoppingListItem";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";

import styles from "./styles";
import { useLocale, useShoppingList, useTheme } from "../../store";
import { ShoppingItem } from "../../store/types";

const ShoppingList = () => {
  const { t } = useLocale();
  const { theme } = useTheme();
  const { shoppingItems, shoppingListContext } = useShoppingList();

  const [newItemName, setNewItemName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const inputRef = useRef<TextInput>(null);
  const swipeableRefs = useRef<(SwipeableMethods | null)[]>([]);

  const uncheckedItems = shoppingItems.filter((i) => !i.checked);
  const checkedItems = shoppingItems.filter((i) => i.checked);
  const orderedItems = [...uncheckedItems, ...checkedItems];

  const handleAdd = useCallback(async () => {
    const trimmed = newItemName.trim();
    if (!trimmed) return;
    setNewItemName("");
    await shoppingListContext.handleAddItem(trimmed);
  }, [newItemName, shoppingListContext]);

  const handleStartEdit = useCallback((item: ShoppingItem) => {
    setEditingId(item.id);
    setEditingName(item.name);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingId) return;
    const trimmed = editingName.trim();
    if (trimmed) {
      await shoppingListContext.handleUpdateItemName(editingId, trimmed);
    }
    setEditingId(null);
    setEditingName("");
  }, [editingId, editingName, shoppingListContext]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.inner}>
          {/* Add input */}
          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              style={[
                styles.textInput,
                {
                  color: theme.text,
                  backgroundColor: theme.foreground,
                  borderColor: theme.foreground,
                },
              ]}
              value={newItemName}
              onChangeText={setNewItemName}
              placeholder={t("shoppingListPlaceholder")}
              placeholderTextColor="#999"
              returnKeyType="done"
              onSubmitEditing={handleAdd}
              autoCapitalize="sentences"
            />
            <TouchableOpacity
              style={[
                styles.addButton,
                {
                  backgroundColor: theme.primary,
                  opacity: newItemName.trim() ? 1 : 0.4,
                },
              ]}
              onPress={handleAdd}
              disabled={!newItemName.trim()}
            >
              <Text style={styles.addButtonText}>{t("addItemShort")}</Text>
            </TouchableOpacity>
          </View>

          {/* List */}
          {orderedItems.length > 0 ? (
            <FlatList
              style={styles.list}
              data={orderedItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                const isFirstChecked =
                  item.checked &&
                  (index === 0 || !orderedItems[index - 1].checked);
                return (
                  <>
                    {isFirstChecked && uncheckedItems.length > 0 && (
                      <Text
                        style={[styles.sectionLabel, { color: theme.text }]}
                      >
                        {t("checkedItems")}
                      </Text>
                    )}
                    <ShoppingListItem
                      item={item}
                      isEditing={editingId === item.id}
                      editingName={editingName}
                      onToggle={() =>
                        shoppingListContext.handleToggleItem(
                          item.id,
                          !item.checked,
                        )
                      }
                      onDelete={() => {
                        swipeableRefs.current[index]?.close();
                        shoppingListContext.handleDeleteItem(item.id);
                      }}
                      onStartEdit={() => handleStartEdit(item)}
                      onEditNameChange={setEditingName}
                      onSaveEdit={handleSaveEdit}
                      ref={(el) => {
                        swipeableRefs.current[index] = el;
                      }}
                    />
                  </>
                );
              }}
              keyboardShouldPersistTaps="handled"
            />
          ) : (
            <Text style={[styles.emptyText, { color: theme.text }]}>
              {t("shoppingListEmpty")}
            </Text>
          )}

          {/* Clear checked */}
          {checkedItems.length > 0 && (
            <TouchableOpacity
              style={[styles.clearButton, { borderColor: theme.primary }]}
              onPress={shoppingListContext.handleClearChecked}
            >
              <Text style={[styles.clearButtonText, { color: theme.primary }]}>
                {t("clearChecked")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ShoppingList;
