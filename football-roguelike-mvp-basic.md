# Football Roguelike — MVP Basic

## 1. Visione del gioco

Gioco web roguelike a tema calcistico con partite a fasi tattiche e meccaniche di deck building.

Il giocatore interpreta l'allenatore di una squadra e affronta una breve run, presentata narrativamente come una stagione, composta da partite e ricompense. Durante ogni partita utilizza carte tattiche per costruire azioni offensive, difendersi e segnare più gol dell'avversario.

L'MVP deve essere semplice, rapido da sviluppare e immediatamente giocabile.

---

## 2. Obiettivo della run

Il giocatore deve completare una **run** composta da **5 partite**: 4 partite normali e 1 partita boss finale.

Dopo ogni partita può:

- ottenere una nuova carta oppure saltare la ricompensa;
- migliorare gradualmente il mazzo.

L'ultima partita della run è una partita boss contro una squadra più forte o dotata di una caratteristica tattica speciale.

La run termina quando:

- il giocatore perde o pareggia una partita;
- oppure completa la stagione vincendo la partita finale.

Per il primo MVP ogni partita deve essere vinta per continuare la run.

---

## 3. Struttura della partita

Ogni partita è composta da:

- **10 fasi**;
- **3 punti energia tattica per fase**;
- **5 carte in mano**;
- un risultato iniziale di **0-0**.

Ogni fase rappresenta un segmento tattico decisivo della partita, senza simulare in modo preciso i minuti reali.

Alla fine della decima fase:

- chi ha segnato più gol vince;
- chi ha segnato meno gol perde;
- in caso di pareggio il giocatore perde la partita ai fini della run.

Per l'MVP:

- il pareggio è considerato una sconfitta;
- i rigori possono essere aggiunti successivamente.

---

## 4. Flusso di una fase

Ogni fase ha sempre una **Intenzione Avversaria** visibile e segue questa sequenza:

1. L'avversario mostra la propria intenzione.
2. Se l'Intenzione Avversaria è difensiva, la sua penalità diventa subito attiva per questa fase.
3. Il giocatore pesca fino ad avere 5 carte.
4. Il giocatore utilizza le carte spendendo energia tattica.
5. Il giocatore può tentare una Conclusione oppure usare il comando **Termina Fase** senza tirare.
6. Quando il giocatore usa **Termina Fase**, se l'Intenzione Avversaria è offensiva viene risolta dopo la Conclusione del giocatore e viene ridotta dalla Copertura. Se il giocatore ha fallito una Conclusione durante la fase, l'eventuale Sbilanciamento rende questa risoluzione più pericolosa.
7. La mano e le carte giocate vengono scartate, poi vengono aggiornati risultato, stati temporanei e mazzo.

Esempio di Intenzione Offensiva:

> L'avversario prepara un contropiede.  
> Minaccia prevista: 6.

Esempio di Intenzione Difensiva:

> L'avversario abbassa il blocco.  
> Penalità alla Conclusione: -15%.

Il giocatore può decidere se:

- investire energia per ridurre la Minaccia;
- continuare a costruire la propria azione offensiva;
- accettare il rischio e preparare un attacco più forte.

La schermata principale della partita deve mostrare sempre:

- punteggio;
- fase corrente su 10;
- Energia Tattica disponibile;
- Intenzione Avversaria visibile con tipo ed effetto;
- probabilità di gol avversario quando l'Intenzione Avversaria è offensiva;
- mano da 5 carte;
- Pericolosità corrente;
- Copertura corrente;
- probabilità di gol mostrata direttamente sulle carte Conclusione disponibili;
- comando **Termina Fase**.

La probabilità mostrata sulle carte Conclusione si aggiorna subito dopo ogni carta giocata o effetto applicato.
La probabilità di gol avversario si aggiorna subito dopo ogni carta difensiva o effetto che modifica la Copertura. Se una Conclusione fallita crea Sbilanciamento, la Copertura effettiva e la probabilità di gol avversario devono aggiornarsi immediatamente, prima che il giocatore usi **Termina Fase**.

---

## 5. Come si segna

Un gol non viene generato direttamente da una singola carta.

Il giocatore deve costruire un'**Azione** attraverso tre momenti:

1. **Costruzione**
2. **Occasione**
3. **Conclusione**

Questa sequenza non è obbligatoria: il giocatore può tentare una Conclusione anche con poca preparazione, se possiede una carta adatta e l'energia necessaria. Costruzione e Occasione servono ad aumentare la Pericolosità e a creare Combinazioni che migliorano la probabilità di segnare.

Per l'MVP, le Combinazioni sono basate su **Tag Tattici** visibili sulle carte, non su ricette rigide carta-per-carta. Per esempio, una carta con tag `Centrale` può combinarsi con una carta che attacca lo `Spazio`, aumentando la qualità della Conclusione successiva.

Pericolosità, Copertura e Combinazioni valgono solo nella fase corrente. Alla fine della fase vengono azzerate, anche se il giocatore non ha tentato una Conclusione.

Set minimo di Tag Tattici per l'MVP Basic:

- `Centrale`
- `Ampiezza`
- `Spazio`
- `Cross`
- `Piazzato`
- `Pressing`

Combinazioni base per l'MVP Basic:

- `Centrale` + `Spazio`: +2 Pericolosità.
- `Ampiezza` + `Cross`: +2 Pericolosità.
- `Pressing` + `Spazio`: +1 Pericolosità e +1 Copertura.
- `Piazzato` + carta di Conclusione: +10% probabilità di gol.

Bonus di Sequenza base per l'MVP Basic:

- `Costruzione` seguita da `Occasione` prima della Conclusione: +5% probabilità di gol alla prossima Conclusione.

Il Bonus di Sequenza premia l'ordine generale dell'Azione e non sostituisce le Combinazioni basate su Tag Tattici. Può attivarsi al massimo una volta per fase.

Per il Basic le Combinazioni richiedono solo coppie di tag o una coppia tag-carta. Non sono previste Combinazioni a tre o più carte.

Ogni Combinazione può attivarsi al massimo una volta per fase. Combinazioni diverse possono essere attive nella stessa fase.

Esempio:

```text
Passaggio corto
→ Verticalizzazione
→ Inserimento
→ Tiro piazzato
```

Le carte offensive aumentano un valore chiamato **Pericolosità**.

Quando viene utilizzata una carta di tiro, il gioco calcola la probabilità di segnare considerando:

- pericolosità accumulata;
- potenza della carta di tiro;
- Bonus Passivi dei Calciatori;
- Esposizione Avversaria dell'Intenzione Offensiva corrente;
- difesa avversaria o penalità dell'Intenzione Difensiva;
- bonus e malus temporanei della fase.

Esempio semplificato:

```text
Probabilità gol =
base della carta Conclusione
+ Pericolosità * 5%
+ Bonus di Sequenza
+ bonus Combinazioni
+ Bonus Passivi
+ Esposizione Avversaria
- penalità Intenzione Difensiva
- difesa avversaria * 5%
```

Per l'MVP Basic, la probabilità finale di gol è sempre compresa tra **10%** e **85%**, dopo l'applicazione di Pericolosità, Bonus di Sequenza, Combinazioni, Bonus Passivi, difesa avversaria e penalità.

La probabilità mostrata sulle carte Conclusione deve rendere visibile il Bonus di Sequenza prima che il giocatore tenti la Conclusione.

Esempio:

```text
Tiro: 25%
Pericolosità: 5 = +25%
Difesa avversaria: 3 = -15%
Probabilità finale: 35%
```

Possibili risultati della conclusione:

- gol;
- parata;
- tiro fuori;
- calcio d'angolo;
- respinta.

Per il primo MVP è sufficiente gestire:

- gol;
- tiro fallito.

Per l'MVP il giocatore può tentare al massimo una Conclusione per fase, ma la Conclusione è opzionale: il giocatore può terminare la fase senza tirare. Dopo una Conclusione, la fase non termina automaticamente: il giocatore deve usare il comando **Termina Fase** per passare alla risoluzione successiva, ma non può più giocare altre carte in quella fase, incluse carte difensive.

Una Conclusione riuscita non crea rischio di ripartenza: narrativamente il gioco riparte da un calcio d'inizio. Una Conclusione fallita crea Sbilanciamento solo se l'Intenzione Avversaria corrente è offensiva; contro un'Intenzione Difensiva non genera un attacco avversario nascosto.

In futuro alcune carte speciali potranno rompere questa regola, per esempio consentendo una ribattuta o una seconda occasione.

---

## 6. Intenzioni dell'avversario

L'avversario utilizza un sistema automatico basato su intenzioni visibili.

Per l'MVP esistono due famiglie di Intenzione Avversaria:

- **Intenzione Offensiva**: possiede un valore di **Minaccia** e può portare a un gol dell'avversario;
- **Intenzione Difensiva**: non minaccia direttamente un gol, ma riduce l'efficacia dell'Azione o della Conclusione del giocatore.

Le Intenzioni Offensive possono anche avere **Esposizione Avversaria**, cioè lo spazio che l'avversario concede mentre attacca. Minaccia ed Esposizione Avversaria sono valori separati: una Intenzione può essere molto pericolosa senza concedere molto spazio, oppure essere rischiosa per entrambe le squadre.

Per l'MVP non esiste una meccanica dedicata per contrastare le Intenzioni Difensive. Il giocatore risponde costruendo più Pericolosità, cercando una Combinazione migliore o accettando una Conclusione meno favorevole.

Per l'MVP Basic, le Intenzioni Difensive usano solo penalità numeriche semplici:

- riduzione della Pericolosità dell'Azione;
- riduzione della probabilità di gol della Conclusione.

Le Intenzioni Offensive calcolano la Minaccia sommando la potenza base dell'intenzione all'Attacco dell'avversario.

```text
Minaccia = potenza Intenzione Offensiva + Attacco avversario
```

Valori iniziali delle Intenzioni Offensive:

| Intenzione Offensiva | Potenza base Minaccia | Esposizione Avversaria |
| --- | ---: | ---: |
| **Attacco paziente** | 1 | +0% |
| **Attacco centrale** | 2 | +5% |
| **Contropiede** | 3 | +5% |
| **Assalto finale** | 4 | +15% |

Contropiede usa la stessa Esposizione Avversaria di Attacco centrale, ma aumenta a **3** lo Sbilanciamento generato da una Conclusione fallita.

Intenzioni Difensive iniziali:

- **Blocco basso**: -2 Pericolosità all'Azione del giocatore.
- **Pressing avversario**: -10% probabilità di gol alla Conclusione del giocatore.

Lo Sbilanciamento riduce la Copertura solo nella risoluzione di una Intenzione Offensiva visibile. Non può trasformare la Copertura in un valore negativo: al massimo la azzera.

Per l'MVP Basic lo Sbilanciamento ha valore fisso:

- **2** dopo una Conclusione fallita contro una Intenzione Offensiva;
- **3** dopo una Conclusione fallita contro **Contropiede**.

Esempio:

```text
Minaccia avversaria: 8
Copertura creata dal giocatore: 5
Sbilanciamento da Conclusione fallita: 2
Copertura effettiva: 3
Minaccia residua: 5
```

Esempio contro Contropiede:

```text
Minaccia Contropiede: 6
Copertura creata dal giocatore: 5
Sbilanciamento da Conclusione fallita: 3
Copertura effettiva: 2
Minaccia residua: 4
```

La Minaccia residua determina la probabilità che l'avversario segni. Anche la probabilità di gol dell'avversario è compresa tra **10%** e **85%**.

Formula iniziale:

```text
Copertura effettiva = max(0, Copertura - Sbilanciamento)

Minaccia residua = max(0, Minaccia - Copertura effettiva)

Probabilità gol avversario =
10%
+ Minaccia residua * 10%
- Bonus Passivi difensivi
```

Esempio:

```text
Minaccia: 6
Copertura: 3
Minaccia residua: 3
Probabilità gol avversario: 40%
```

Il giocatore può ridurre la minaccia utilizzando carte difensive come:

- Pressing;
- Ripiegamento;
- Marcatura;
- Intercetto;
- Possesso palla.

---

## 7. Carte

Le carte rappresentano azioni tattiche e tecniche.

### Carte offensive

- Passaggio corto
- Verticalizzazione
- Passaggio filtrante
- Cross
- Inserimento
- Tiro dalla distanza
- Tiro piazzato

### Carte difensive

- Pressing alto
- Ripiegamento difensivo
- Marcatura a uomo
- Intercetto
- Copertura preventiva

### Carte di supporto

- Cambio di gioco
- Motivazione
- Analisi dell'avversario
- Sostituzione

Ogni carta possiede almeno:

- nome;
- descrizione;
- costo in energia;
- tipo;
- valore dell'effetto;
- uno o più Tag Tattici, quando rilevanti.

Per l'MVP Basic l'Energia Tattica è fissa a 3 punti per fase. Le carte non generano energia, non la conservano tra le fasi e non aumentano il limite disponibile.

Tutte le carte dell'MVP Basic costano 1 Energia Tattica.

Quando il giocatore usa una carta, l'effetto viene applicato subito e non esiste undo nell'MVP Basic.

Alla fine di ogni fase, tutte le carte in mano e tutte le carte giocate vengono messe negli scarti. Il giocatore non conserva carte tra una fase e la successiva.

Se il mazzo finisce durante la pesca, gli scarti vengono rimescolati per formare un nuovo mazzo e la pesca continua.

---

## 8. Mazzo iniziale

Il giocatore inizia ogni run con un mazzo semplice di circa **15 carte**.

Esempio:

- 3x **Passaggio corto**: Costruzione, costo 1, +1 Pericolosità, tag `Centrale`;
- 2x **Cambio gioco**: Costruzione, costo 1, +1 Pericolosità, tag `Ampiezza`;
- 2x **Inserimento**: Occasione, costo 1, +2 Pericolosità, tag `Spazio`;
- 1x **Cross**: Occasione, costo 1, +2 Pericolosità, tag `Cross`;
- 3x **Tiro**: Conclusione, costo 1, 25% probabilità base di gol;
- 2x **Pressing**: difensiva, costo 1, +2 Copertura, tag `Pressing`;
- 2x **Ripiegamento**: difensiva, costo 1, +3 Copertura.

Il mazzo deve permettere fin dall'inizio di:

- creare almeno un'azione offensiva;
- difendersi;
- effettuare una conclusione.

Dopo ogni partita vinta il giocatore può aggiungere una carta scegliendo tra tre ricompense casuali, oppure saltare la scelta per mantenere il mazzo più snello.

Per l'MVP Basic le tre ricompense vengono generate da un pool di **12 carte**: le 7 carte presenti nel mazzo iniziale più 5 carte aggiuntive.

Le tre opzioni mostrate dopo una vittoria devono essere diverse tra loro. Possono però includere carte già presenti nel mazzo del giocatore, permettendo di aggiungerne copie ulteriori.

Carte aggiuntive consigliate:

- **Verticalizzazione**: Costruzione, costo 1, +2 Pericolosità, tag `Centrale`;
- **Tiro piazzato**: Conclusione, costo 1, 20% probabilità base di gol, tag `Piazzato`;
- **Marcatura**: difensiva, costo 1, +4 Copertura;
- **Azione sulla fascia**: Occasione, costo 1, +1 Pericolosità, tag `Ampiezza`;
- **Calcio piazzato**: Costruzione, costo 1, +1 Pericolosità, tag `Piazzato`.

---

## 9. Giocatori della squadra

Per il primo MVP la Squadra è composta da **1 Icona** e **2 Calciatori Comuni**, assegnati casualmente all'inizio della run e fissi fino alla fine della run. L'Icona viene estratta da un pool iniziale di **6 Icone**, mentre i Calciatori Comuni vengono estratti dal pool iniziale di **10 Calciatori Comuni**.

Ogni Calciatore fornisce un **Bonus Passivo** che potenzia alcune carte, alcuni Tag Tattici o un tipo di esito. Le Icone hanno Bonus Passivi più impattanti e possono avere due componenti correlate, ma restano passive. I Calciatori non vengono controllati direttamente durante la Partita e le carte non sono associate a un Calciatore specifico.

Per l'MVP Basic i Bonus Passivi possono riferirsi a:

- un tipo di carta, per esempio Costruzione, Occasione, Conclusione o difensiva;
- uno o più Tag Tattici;
- un esito specifico, per esempio probabilità di gol o Copertura.

I Bonus Passivi possono sommarsi tra loro. Il bilanciamento viene controllato soprattutto attraverso limiti finali alla probabilità di gol e valori numerici piccoli.

Esempi:

- **Bomber**: bonus alle Conclusioni;
- **Regista**: bonus alle carte di Costruzione;
- **Mediano**: bonus alle carte difensive;
- **Ala**: bonus ai Tag Tattici legati a `Ampiezza` o `Cross`;
- **Leader**: piccolo bonus quando la Squadra è in svantaggio.

Pool iniziale consigliato:

1. **Bomber**: +10% alle Conclusioni.
2. **Regista**: +1 Pericolosità alle carte di Costruzione.
3. **Rifinitore**: +1 Pericolosità alle carte di Occasione.
4. **Mediano**: +1 Copertura alle carte difensive.
5. **Terzino di spinta**: +1 Pericolosità alle carte con tag `Ampiezza`.
6. **Ala rapida**: +1 Pericolosità alle carte con tag `Spazio`.
7. **Centrale roccioso**: +1 Copertura contro Minaccia alta.
8. **Capitano**: +5% alle Conclusioni quando la Squadra è in svantaggio.
9. **Portiere leader**: -5% alla probabilità di gol avversaria.
10. **Specialista**: +10% alle Conclusioni con tag `Piazzato`.

Per l'MVP Basic i Calciatori non hanno statistiche separate come attacco, difesa, tecnica o resistenza. La loro identità meccanica è rappresentata solo dal Bonus Passivo.

---

## 10. Avversari

L'MVP Basic usa una sequenza fissa di **5 avversari**, uno per partita. Questo rende più semplice testare difficoltà, ricompense e progressione della run.

Ogni avversario possiede due statistiche base:

- **Attacco**: influenza la Minaccia delle Intenzioni Offensive;
- **Difesa**: riduce la probabilità di gol del giocatore nella formula della Conclusione.

Ogni avversario possiede anche un **Mazzo Intenzioni** da **8 carte**. All'inizio di ogni fase pesca una Intenzione Avversaria dal proprio Mazzo Intenzioni; quando il mazzo finisce, le intenzioni scartate vengono rimescolate.

Sequenza consigliata:

1. **Squadra equilibrata**: Attacco 2, Difesa 2; tutorial, valori medi, intenzioni semplici.
2. **Squadra difensiva**: Attacco 1, Difesa 4; introduce Intenzioni Difensive e penalità al tiro.
3. **Squadra offensiva**: Attacco 4, Difesa 2; alza la Minaccia e costringe a usare Copertura.
4. **Squadra da contropiede**: Attacco 3, Difesa 3; punisce quando il giocatore ignora la difesa.
5. **Boss misto**: Attacco 4, Difesa 4; combina difesa solida e Minacce alte.

Mazzi Intenzioni iniziali:

- **Squadra equilibrata**: 3x Attacco paziente, 2x Attacco centrale, 2x Blocco basso, 1x Pressing avversario.
- **Squadra difensiva**: 4x Blocco basso, 2x Pressing avversario, 1x Attacco paziente, 1x Attacco centrale.
- **Squadra offensiva**: 3x Attacco centrale, 2x Contropiede, 2x Assalto finale, 1x Blocco basso.
- **Squadra da contropiede**: 4x Contropiede, 2x Blocco basso, 1x Attacco paziente, 1x Pressing avversario.
- **Boss misto**: 2x Blocco basso, 2x Pressing avversario, 2x Contropiede, 2x Assalto finale.

Gli avversari sono costruiti a partire da questi archetipi:

### Squadra equilibrata

- valori medi;
- intenzioni leggibili;
- difficoltà bassa.

### Squadra difensiva

- alta difesa;
- pochi attacchi;
- difficile da superare.

### Squadra offensiva

- crea molte occasioni;
- difesa più debole;
- obbliga il giocatore a bilanciare attacco e difesa.

### Squadra da contropiede

- attacca quando il giocatore investe troppo in fase offensiva;
- utilizza intenzioni prevedibili ma pericolose.

La squadra boss può combinare più archetipi o avere un'abilità speciale.

---

## 11. Progressione tra le partite

Dopo una vittoria il giocatore riceve una ricompensa.

Possibili ricompense:

- nuova carta;
- scelta di saltare la ricompensa per non diluire il mazzo.

Per il primo MVP è sufficiente implementare:

1. scelta di una nuova carta tra tre, con possibilità di saltare;
2. aumento progressivo della difficoltà degli avversari.

La rimozione e il potenziamento permanente delle carte sono rimandati a una fase successiva, quando la gestione del mazzo sarà più importante.

---

## 12. Eventi tra le partite

Gli eventi tra le partite sono rimandati a una fase successiva.

Quando verranno introdotti, dovranno essere semplici e basati su una scelta.

Esempio:

> Il tuo attaccante viene fotografato in discoteca prima della partita.

Scelte:

- Multalo: meno morale, più disciplina;
- Ignora: più morale, penalità temporanea;
- Lascialo in panchina: perdi una carta offensiva nella prossima partita.

Per l'MVP Basic non sono previsti eventi tra le partite.

---

## 13. Condizioni di vittoria e sconfitta

### Vittoria della partita

Il giocatore vince se ha segnato più gol dell'avversario dopo 10 fasi.

### Sconfitta della partita

Il giocatore perde se ha segnato meno gol dell'avversario dopo 10 fasi o se la partita finisce in pareggio.

### Fine della run

Per la prima versione:

- vittoria della partita boss: run completata;
- sconfitta o pareggio in qualsiasi partita: run terminata.

In seguito sarà possibile introdurre:

- vite;
- punti classifica;
- pareggi;
- playoff;
- rigori.

---

## 14. Regole consigliate per il bilanciamento iniziale

- 10 fasi per partita;
- 3 energia per fase;
- 5 carte in mano;
- mazzo iniziale da circa 15 carte;
- massimo una conclusione principale per fase;
- media attesa di 2-4 gol totali per partita;
- probabilità di gol compresa tra 10% e 85%;
- probabilità di gol sempre visibile prima del tiro;
- Intenzione Avversaria sempre visibile prima delle azioni del giocatore.

La fortuna deve influenzare il risultato, ma il giocatore deve poter aumentare chiaramente le proprie probabilità attraverso una buona gestione delle carte.

Per l'MVP Basic la casualità usa RNG puro: non sono previsti pity timer, garanzie nascoste o correzioni anti-sfortuna. Le probabilità rilevanti devono essere sempre visibili prima della scelta.

Ogni run genera automaticamente un seed per debug e riproducibilità. Nell'MVP Basic non è previsto l'inserimento manuale di un seed da parte del giocatore.

---

## 15. Funzionalità comprese nell'MVP

Target tecnico:

- web app single-player realizzata con **Next.js**;
- gameplay interamente frontend;
- nessun backend, server API o database;
- stato della run mantenuto in memoria;
- dati di carte, Calciatori, avversari e Intenzioni definiti come dati statici nel codice Next.js;
- RNG locale con seed automatico.

Flow minimo:

1. **Nuova Run**
2. **Squadra iniziale**: mostra l'Icona, i 2 Calciatori Comuni estratti e i loro Bonus Passivi
3. **Partita**
4. **Ricompensa** dopo vittoria: scegli 1 carta tra 3 oppure salta
5. Ripetizione Partita/Ricompensa fino al Boss
6. **Vittoria Run** o **Game Over**

Funzionalità incluse:

- nuova run;
- squadra iniziale;
- mazzo iniziale;
- partita a fasi tattiche;
- energia tattica;
- pesca e utilizzo delle carte;
- costruzione della pericolosità;
- conclusioni e gol;
- intenzioni dell'avversario;
- risultato finale;
- ricompensa dopo la vittoria;
- progressione di 5 partite;
- partita boss finale;
- schermata di vittoria o game over.

---

## 16. Funzionalità escluse dall'MVP

- multiplayer;
- mercato complesso;
- contratti;
- stipendi;
- campionato realistico;
- simulazione in tempo reale;
- grafica 3D;
- controllo diretto dei calciatori;
- telecronaca avanzata;
- infortuni complessi;
- cartellini e falli dettagliati;
- metaprogressione permanente;
- salvataggio persistente della run;
- associazione completa tra carte e singoli giocatori;
- eventi tra le partite;
- supplementari e rigori avanzati.

---

## 17. Principio guida

Il cuore del gioco deve essere questa decisione:

> Utilizzo le mie risorse per costruire un'azione offensiva oppure mi difendo dall'intenzione dell'avversario?

Ogni fase deve presentare un compromesso chiaro tra rischio, difesa e possibilità di segnare.
