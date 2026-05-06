import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function App() {
  // 1. الحالة (State) - تخزين البيانات
  const [balance, setBalance] = useState(5200);
  const [display, setDisplay] = useState("0");
  const [transactions, setTransactions] = useState([
    { id: 1, icon: '🍔', amount: 50, type: 'Expense', date: 'اليوم' },
    { id: 2, icon: '🏦', amount: 5000, type: 'Income', date: 'أمس' }
  ]);

  // 2. منطق الآلة الحاسبة (لوحة الأرقام الدائرية)
  const handleNumberPress = (num) => {
    setDisplay(display === "0" ? num : display + num);
  };

  const clearDisplay = () => setDisplay("0");

  const saveTransaction = () => {
    const amount = parseFloat(display);
    if (amount > 0) {
      const newTx = { id: Date.now(), icon: '💰', amount: amount, type: 'Expense', date: 'اليوم' };
      setTransactions([newTx, ...transactions]);
      setBalance(balance - amount);
      setDisplay("0");
    }
  };

  return (
    <View style={styles.container}>
      {/* القسم العلوي: المؤشرات (KPIs) */}
      <View style={styles.header}>
        <Text style={styles.happinessEmoji}>😊</Text>
        <Text style={styles.netWorthLabel}>صافي الثروة</Text>
        <Text style={styles.balanceText}>{balance.toLocaleString()} ج.م</Text>
        <View style={styles.miniChartPlaceholder}>
          <Text style={{color: '#495670', fontSize: 12}}>رسم بياني للنمو 📈</Text>
        </View>
      </View>

      {/* سجل الحركات (Timeline) */}
      <ScrollView style={styles.history}>
        {transactions.map(item => (
          <View key={item.id} style={styles.txRow}>
            <Text style={styles.txIcon}>{item.icon}</Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <Text style={styles.txAmount}>{item.amount} ج.م</Text>
              <Text style={styles.txDate}>{item.date}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* لوحة الأرقام الدائرية والآلة الحاسبة */}
      <View style={styles.calcContainer}>
        <View style={styles.displayArea}>
          <Text style={styles.displayText}>{display}</Text>
        </View>
        
        <View style={styles.numPad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✅'].map((item) => (
            <TouchableOpacity 
              key={item} 
              style={[styles.circleBtn, item === '✅' ? styles.saveBtn : item === 'C' ? styles.clearBtn : null]}
              onPress={() => {
                if (item === '✅') saveTransaction();
                else if (item === 'C') clearDisplay();
                else handleNumberPress(item.toString());
              }}
            >
              <Text style={styles.btnText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A192F', paddingTop: 50 },
  header: { alignItems: 'center', marginBottom: 20 },
  happinessEmoji: { fontSize: 40, marginBottom: 5 },
  netWorthLabel: { color: '#8892b0', fontSize: 16, fontFamily: 'Cairo' },
  balanceText: { color: '#64ffda', fontSize: 40, fontWeight: 'bold' },
  miniChartPlaceholder: { width: '80%', height: 40, backgroundColor: '#112240', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  
  history: { flex: 1, paddingHorizontal: 20 },
  txRow: { flexDirection: 'row', backgroundColor: '#112240', padding: 15, borderRadius: 15, marginBottom: 10, alignItems: 'center' },
  txIcon: { fontSize: 24, marginLeft: 15 },
  txAmount: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  txDate: { color: '#495670', fontSize: 12 },

  calcContainer: { backgroundColor: '#112240', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 },
  displayArea: { alignItems: 'flex-end', marginBottom: 15, paddingRight: 10 },
  displayText: { color: '#64ffda', fontSize: 35, fontWeight: 'bold' },
  numPad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  circleBtn: { width: width / 5, height: width / 5, borderRadius: width / 10, backgroundColor: '#1d2d50', justifyContent: 'center', alignItems: 'center', margin: 8 },
  btnText: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#2ECC71' },
  clearBtn: { backgroundColor: '#E74C3C' }
});
