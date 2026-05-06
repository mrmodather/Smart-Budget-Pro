import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Modal } from 'react-native';

const { width, height } = Dimensions.get('window');

// 1. تعريف الفئات الذكية (أيقونات ملونة)
const CATEGORIES = [
  { id: '1', icon: '🏠', label: 'سكن', color: '#3498DB', type: 'Needs' },
  { id: '2', icon: '🛒', label: 'تسوق', color: '#F1C40F', type: 'Needs' },
  { id: '3', icon: '🍔', label: 'طعام', color: '#E74C3C', type: 'Wants' },
  { id: '4', icon: '🎬', label: 'ترفيه', color: '#9B59B6', type: 'Wants' },
  { id: '5', icon: '💊', label: 'صحة', color: '#1ABC9C', type: 'Needs' },
  { id: '6', icon: '🔄', label: 'تحويل', color: '#95A5A6', type: 'Transfer' },
];

export default function App() {
  const [balance, setBalance] = useState(5200);
  const [display, setDisplay] = useState("0");
  const [showCatModal, setShowCatModal] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: 1, icon: '🏠', amount: 1200, color: '#3498DB', date: '01 مايو' },
    { id: 2, icon: '🍔', amount: 80, color: '#E74C3C', date: 'اليوم' }
  ]);

  // منطق الآلة الحاسبة
  const handlePress = (val) => {
    if (val === 'C') setDisplay("0");
    else if (val === '✅') {
      if (parseFloat(display) > 0) setShowCatModal(true);
    } else {
      setDisplay(display === "0" ? val : display + val);
    }
  };

  // إتمام الحركة وتصنيفها (التفصيل الذكي)
  const finalizeTransaction = (category) => {
    const amount = parseFloat(display);
    const newTx = {
      id: Date.now(),
      icon: category.icon,
      amount: amount,
      color: category.color,
      date: 'اليوم'
    };
    setTransactions([newTx, ...transactions]);
    setBalance(balance - amount);
    setDisplay("0");
    setShowCatModal(false);
  };

  return (
    <View style={styles.container}>
      {/* القسم العلوي: مؤشرات الأداء (KPIs) */}
      <View style={styles.header}>
        <Text style={styles.happinessEmoji}>😊</Text>
        <Text style={styles.netWorthLabel}>صافي القيمة</Text>
        <Text style={styles.balanceText}>{balance.toLocaleString()} ج.م</Text>
      </View>

      {/* سجل الحركات التاريخي */}
      <ScrollView style={styles.history}>
        <Text style={styles.sectionTitle}>آخر العمليات</Text>
        {transactions.map(tx => (
          <View key={tx.id} style={styles.txRow}>
            <View style={[styles.iconCircle, {backgroundColor: tx.color}]}>
              <Text style={{fontSize: 20}}>{tx.icon}</Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <Text style={styles.txAmount}>{tx.amount} ج.م</Text>
              <Text style={styles.txDate}>{tx.date}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* لوحة الأرقام الدائرية */}
      <View style={styles.calcBox}>
        <View style={styles.screen}><Text style={styles.screenText}>{display}</Text></View>
        <View style={styles.numPad}>
          {['1','2','3','4','5','6','7','8','9','C','0','✅'].map(k => (
            <TouchableOpacity key={k} style={[styles.dot, k==='✅'?styles.go:k==='C'?styles.clear:null]} onPress={()=>handlePress(k)}>
              <Text style={styles.dotText}>{k}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* نافذة التفصيل (اختيار الفئة) */}
      <Modal visible={showCatModal} transparent animationType="slide">
        <View style={styles.modalBack}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>صنف حركتك</Text>
            <View style={styles.catGrid}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity key={cat.id} style={styles.catItem} onPress={()=>finalizeTransaction(cat)}>
                  <View style={[styles.catIcon, {backgroundColor: cat.color}]}><Text style={{fontSize: 30}}>{cat.icon}</Text></View>
                  <Text style={styles.catLabel}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={()=>setShowCatModal(false)}><Text style={{color:'#FFF'}}>إلغاء</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A192F', paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 20 },
  happinessEmoji: { fontSize: 45 },
  netWorthLabel: { color: '#8892b0', fontSize: 16, fontFamily: 'Cairo' },
  balanceText: { color: '#64ffda', fontSize: 42, fontWeight: 'bold' },
  
  history: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { color: '#FFF', fontSize: 18, marginBottom: 15, textAlign: 'right' },
  txRow: { flexDirection: 'row', backgroundColor: '#112240', padding: 15, borderRadius: 20, marginBottom: 12, alignItems: 'center' },
  iconCircle: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  txAmount: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  txDate: { color: '#495670', fontSize: 12 },

  calcBox: { backgroundColor: '#112240', borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 20, paddingBottom: 40 },
  screen: { alignItems: 'flex-end', marginBottom: 15 },
  screenText: { color: '#64ffda', fontSize: 38, fontWeight: 'bold' },
  numPad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  dot: { width: width/5.5, height: width/5.5, borderRadius: width/11, backgroundColor: '#1d2d50', justifyContent: 'center', alignItems: 'center', margin: 8 },
  dotText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  go: { backgroundColor: '#2ECC71' },
  clear: { backgroundColor: '#E74C3C' },

  modalBack: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#112240', padding: 30, borderTopLeftRadius: 40, borderTopRightRadius: 40, alignItems: 'center' },
  modalTitle: { color: '#FFF', fontSize: 22, marginBottom: 25, fontWeight: 'bold' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  catItem: { alignItems: 'center', margin: 15 },
  catIcon: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  catLabel: { color: '#BDC3C7', fontSize: 14 },
  closeBtn: { marginTop: 20, padding: 10 }
});
