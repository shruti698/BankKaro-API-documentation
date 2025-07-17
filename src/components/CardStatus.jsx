import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const CardStatus = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const cardData = [
    { name: 'MRCC', status: 'Live', bank: 'AMEX' },
    { name: 'AMEX PLATINUM TRAVEL', status: 'Live', bank: 'AMEX' },
    { name: 'AMEX SMART EARN', status: 'Live', bank: 'AMEX' },
    { name: 'AU ALTURA', status: 'Live', bank: 'AU Bank' },
    { name: 'AU ZENITH', status: 'Live', bank: 'AU Bank' },
    { name: 'AU ZENITH PLUS', status: 'Live', bank: 'AU Bank' },
    { name: 'AXIS AIRTEL CC', status: 'Live', bank: 'Axis Bank' },
    { name: 'AXIS FLIPKART', status: 'Live', bank: 'Axis Bank' },
    { name: 'AXIS INDIAN OIL RUPAY', status: 'Live', bank: 'Axis Bank' },
    { name: 'AXIS MAGNUS', status: 'Live', bank: 'Axis Bank' },
    { name: 'AXIS MY ZONE', status: 'Live', bank: 'Axis Bank' },
    { name: 'AXIS VISTARA', status: 'Live', bank: 'Axis Bank' },
    { name: 'HDFC INDIAN OIL', status: 'Live', bank: 'HDFC Bank' },
    { name: 'HDFC INFINIA', status: 'Live', bank: 'HDFC Bank' },
    { name: 'HDFC MILLENIA', status: 'Live', bank: 'HDFC Bank' },
    { name: 'HDFC SWIGGY', status: 'Live', bank: 'HDFC Bank' },
    { name: 'HDFC TATA NEU', status: 'Live', bank: 'HDFC Bank' },
    { name: 'HDFC SHOPPERS STOP', status: 'Live', bank: 'HDFC Bank' },
    { name: 'SBI BPCL OCTANE', status: 'Live', bank: 'SBI' },
    { name: 'SBI CASHBACK', status: 'Live', bank: 'SBI' },
    { name: 'SBI SIMPLY CLICK', status: 'Live', bank: 'SBI' },
    { name: 'StanC EASE MY TRIP', status: 'Live', bank: 'Standard Chartered' },
    { name: 'StanC SMART', status: 'Live', bank: 'Standard Chartered' },
    { name: 'ICICI HPCL SUPER SAVER', status: 'Live', bank: 'ICICI Bank' },
    { name: 'ICICI HPCL CORAL', status: 'Live', bank: 'ICICI Bank' },
    { name: 'IDFC FIRST SELECT', status: 'Live', bank: 'IDFC First Bank' },
    { name: 'IDFC POWER PLUS', status: 'Live', bank: 'IDFC First Bank' },
    { name: 'IndusInd EASYDINER', status: 'Live', bank: 'IndusInd Bank' },
    { name: 'IndusInd LEGEND', status: 'Live', bank: 'IndusInd Bank' },
    { name: 'IndusInd PLATINUM RUPAY', status: 'Live', bank: 'IndusInd Bank' },
    { name: 'ICICI PLATINUM CHIP', status: 'Live', bank: 'ICICI Bank' },
    { name: 'MakeMyTrip ICICI Bank Credit Card', status: 'Live', bank: 'ICICI Bank' },
    { name: 'IDFC CLUB VISTARA', status: 'Live', bank: 'IDFC First Bank' },
    { name: 'AXIS PRIVILEGE CREDIT CARD', status: 'Live', bank: 'Axis Bank' },
    { name: 'Samsung Axis Bank Infinite Credit Card', status: 'Live', bank: 'Axis Bank' },
    { name: 'Samsung Axis Bank Signature Credit Card', status: 'Live', bank: 'Axis Bank' },
    { name: 'AXIS SELECT CREDIT CARD', status: 'Live', bank: 'Axis Bank' },
    { name: 'HDFC Marriott Bonvoy Credit Card', status: 'Live', bank: 'HDFC Bank' },
    { name: 'HDFC IRCTC Credit Card', status: 'Live', bank: 'HDFC Bank' },
    { name: 'HDFC RuPay Credit Card', status: 'Live', bank: 'HDFC Bank' },
    { name: 'IDFC FIRST WOW CREDIT CARD', status: 'Live', bank: 'IDFC First Bank' },
    { name: 'IDFC FIRST MILLENIA CREDIT CARD', status: 'Live', bank: 'IDFC First Bank' },
    { name: 'IDFC ASHVA CREDIT CARD', status: 'Live', bank: 'IDFC First Bank' },
    { name: 'IDFC MAYURA CREDIT CARD', status: 'Live', bank: 'IDFC First Bank' },
    { name: 'IndusInd Platinum Aura Edge Credit Card', status: 'In Progress', bank: 'IndusInd Bank' },
    { name: 'IndusInd Tiger Credit Card', status: 'In Progress', bank: 'IndusInd Bank' },
    { name: 'SBI ELITE CREDIT CARD', status: 'Live', bank: 'SBI' },
    { name: 'SBI Prime Credit Card', status: 'Live', bank: 'SBI' },
    { name: 'SBI SimplySave Credit Card', status: 'Live', bank: 'SBI' },
    { name: 'AMEX GOLD CREDIT CARD', status: 'Live', bank: 'AMEX' },
    { name: 'Axis Rewards Credit Card', status: 'Live', bank: 'Axis Bank' },
    { name: 'AXIS AURA CREDIT CARD', status: 'Live', bank: 'Axis Bank' },
    { name: 'HDFC Freedom Credit Card', status: 'Live', bank: 'HDFC Bank' },
    { name: '6E Rewards - Indigo HDFC', status: 'Live', bank: 'HDFC Bank' },
    { name: 'IDFC Wealth Credit Card', status: 'Live', bank: 'IDFC First Bank' },
    { name: 'IDFC FIRST CLASSIC CREDIT CARD', status: 'Live', bank: 'IDFC First Bank' },
    { name: 'IDFC POWER', status: 'Live', bank: 'IDFC First Bank' },
    { name: 'ICICI Amazon Pay Credit Card', status: 'Live', bank: 'ICICI Bank' },
    { name: 'HSBC Live+ Credit Card', status: 'Live', bank: 'HSBC' },
    { name: 'HSBC Platinum Credit Card', status: 'Live', bank: 'HSBC' },
    { name: 'HDFC Regalia Gold Credit Card', status: 'Live', bank: 'HDFC Bank' },
    { name: 'RBL Shoprite Credit Card', status: 'Live', bank: 'RBL Bank' },
    { name: 'Tata Neu Infinity HDFC Bank Credit Card', status: 'Live', bank: 'HDFC Bank' },
    { name: 'YES BANK POP-CLUB Credit Card', status: 'Live', bank: 'YES Bank' },
    { name: 'IndianOil RBL Bank Credit Card', status: 'Live', bank: 'RBL Bank' },
    { name: 'Indian Oil RBL Bank XTRA Credit Card', status: 'Live', bank: 'RBL Bank' },
    { name: 'HSBC Premier Credit Card', status: 'Live', bank: 'HSBC' },
    { name: 'HDFC Diners Black Credit Card', status: 'Live', bank: 'HDFC Bank' },
    { name: 'IDFC First Private Credit Card', status: 'Live', bank: 'IDFC First Bank' },
    { name: 'RBL World Safari Credit Card', status: 'Live', bank: 'RBL Bank' },
    { name: 'HDFC MoneyBack Plus Credit Card', status: 'Live', bank: 'HDFC Bank' },
    { name: 'Kotak Zen Signature', status: 'In Progress', bank: 'Kotak Mahindra Bank' },
    { name: 'Standard Chartered Ultimate', status: 'Live', bank: 'Standard Chartered' },
    { name: 'AU Nomo Credit Card', status: 'Live', bank: 'AU Bank' },
    { name: 'Kotak IndianOil Platinum Credit Card', status: 'In Progress', bank: 'Kotak Mahindra Bank' },
    { name: 'ICICI Rubyx Credit Card', status: 'Live', bank: 'ICICI Bank' },
    { name: 'RBL Insignia Preferred Credit Card', status: 'Live', bank: 'RBL Bank' },
    { name: 'HDFC Diners Club Black Metal Edition', status: 'Live', bank: 'HDFC Bank' },
    { name: 'Kiwi', status: 'Live', bank: 'Kiwi' },
    { name: 'HDFC Superia Airline Credit Card', status: 'Live', bank: 'HDFC Bank' },
    { name: 'Rio Rupay Credit Card', status: 'In Progress', bank: 'Rio' },
    { name: 'PVR Kotak Platinum Credit Card', status: 'Live', bank: 'Kotak Mahindra Bank' },
    { name: 'MakeMyTrip ICICI Bank Signature Credit Card', status: 'In Progress', bank: 'ICICI Bank' },
    { name: 'SBI Card Miles Credit Card', status: 'In Progress', bank: 'SBI' },
    { name: 'HSBC Travel One Credit Card', status: 'In Progress', bank: 'HSBC' },
    { name: 'IDFC First SWYP Credit Card', status: 'In Progress', bank: 'IDFC First Bank' },
    { name: 'IRCTC RBL Credit Card', status: 'In Progress', bank: 'RBL Bank' },
    { name: 'Scapia Credit Card', status: 'In Progress', bank: 'Scapia' },
    { name: 'Standard Chartered Emirates Platinum Credit Card', status: 'In Progress', bank: 'Standard Chartered' },
    { name: 'Axis Shoppers Stop Credit Card', status: 'In Progress', bank: 'Axis Bank' },
    { name: 'SBI IRCTC Platinum Credit Card', status: 'In Progress', bank: 'SBI' },
    { name: 'Myntra Kotak Credit Card', status: 'In Progress', bank: 'Kotak Mahindra Bank' },
    { name: 'HDFC Biz Black Metal Edition Credit Card', status: 'In Progress', bank: 'HDFC Bank' },
    { name: 'Axis Bank Supermoney Rupay Card', status: 'In Progress', bank: 'Axis Bank' },
    { name: 'Jupiter Edge plus', status: 'In Progress', bank: 'Jupiter' },
    { name: 'PIXEL Play Credit Card', status: 'In Progress', bank: 'PIXEL' },
    { name: 'Axis Atlas', status: 'In Progress', bank: 'Axis Bank' },
    { name: 'Axis Privilege Amex Credit Card', status: 'In Progress', bank: 'Axis Bank' },
    { name: 'RBL Bank Play Credit Card', status: 'In Progress', bank: 'RBL Bank' },
    { name: 'SBI Card PULSE', status: 'In Progress', bank: 'SBI' }
  ];

  const filteredCards = cardData.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const liveCards = filteredCards.filter(card => card.status === 'Live');
  const inProgressCards = filteredCards.filter(card => card.status === 'In Progress');

  const getStatusChip = (status) => {
    if (status === 'Live') {
      return (
        <Chip
          icon={<CheckCircleIcon />}
          label="Live"
          color="success"
          variant="outlined"
          size="small"
        />
      );
    } else {
      return (
        <Chip
          icon={<PendingIcon />}
          label="In Progress"
          color="warning"
          variant="outlined"
          size="small"
        />
      );
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <CreditCardIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Credit Card Status
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Comprehensive list of all credit cards available through our platform. 
          Track which cards are live and which are coming soon.
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by card name, bank, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {liveCards.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Live Cards
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {inProgressCards.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {filteredCards.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Cards
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                {new Set(filteredCards.map(card => card.bank)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Partner Banks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Cards Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
                  Credit Card
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
                  Bank/Issuer
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCards.map((card, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {card.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {card.bank}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getStatusChip(card.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Last updated: {new Date().toLocaleDateString()}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Status updates are provided regularly. Contact us for the latest information on card availability.
        </Typography>
      </Box>
    </Box>
  );
};

export default CardStatus; 