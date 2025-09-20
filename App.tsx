import React, { useState } from 'react';
import styled from 'styled-components/native';
import HistoryTab from './HistoryTab';
import SearchTab from './SearchTab';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #0b0b0f;
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
  gap: 16px;
`;

const Title = styled.Text`
  color: #e6e6eb;
  font-size: 22px;
  font-weight: 700;
`;

const TabsRow = styled.View`
  flex-direction: row;
  gap: 10px;
`;

const TabButton = styled.TouchableOpacity<{active?: boolean}>`
  padding: 10px 14px;
  border-radius: 12px;
  background-color: ${p => (p.active ? '#4f46e5' : '#1a1a22')};
`;

const TabText = styled.Text`
  color: #f5f5f7;
  font-weight: 700;
`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'history' | 'search'>('history');

  return (
    <Container>
      <Content>
        <Title>Compteur de calories</Title>
        <TabsRow>
          <TabButton active={activeTab === 'search'} onPress={() => setActiveTab('search')}>
            <TabText>Recherche</TabText>
          </TabButton>
          <TabButton active={activeTab === 'history'} onPress={() => setActiveTab('history')}>
            <TabText>Historique</TabText>
          </TabButton>
        </TabsRow>

        {activeTab === 'history' && <HistoryTab />}

        {activeTab === 'search' && (
          <SearchTab onSaved={() => setActiveTab('history')} />
        )}
      </Content>
    </Container>
  );
}
