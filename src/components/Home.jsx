import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Card,
  CardContent,
  CardActions,
  Avatar,
  useTheme
} from '@mui/material';
import {
  Business as BusinessIcon,
  Api as ApiIcon,
  School as SchoolIcon,
  ArrowForward as ArrowForwardIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  SupportAgent as SupportAgentIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getApiBaseUrl } from '../config/environments';
import { apiData } from '../data/apiData';

const API_BASE_URL = getApiBaseUrl();

const productThemes = {
  'Loan Genius': {
    color: '#3b82f6',
    bg: 'linear-gradient(90deg, #e0e7ff 0%, #f0f9ff 100%)',
    icon: <BusinessIcon fontSize="large" />
  },
  'Card Genius': {
    color: '#10b981',
    bg: 'linear-gradient(90deg, #d1fae5 0%, #f0fdf4 100%)',
    icon: <ApiIcon fontSize="large" />
  },
  'Education Genius': {
    color: '#8b5cf6',
    bg: 'linear-gradient(90deg, #ede9fe 0%, #f3e8ff 100%)',
    icon: <SchoolIcon fontSize="large" />
  }
};

const Home = () => {
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        setLoading(true);
        
        // If no API URL is configured, use static data directly
        if (!API_BASE_URL) {
          console.log('Home - Using static data, apiData keys:', Object.keys(apiData));
          
          const staticEndpoints = Object.entries(apiData)
            .sort((a, b) => {
              // Sort by rank first, then FIFO for equal ranks
              const rankA = a[1].rank || 999; // Default high rank for unranked items
              const rankB = b[1].rank || 999;
              
              console.log(`Comparing ${a[0]} (rank: ${rankA}) vs ${b[0]} (rank: ${rankB})`);
              
              if (rankA !== rankB) {
                return rankA - rankB; // Lower rank numbers appear first
              }
              
              // If ranks are equal, maintain FIFO order (return 0)
              return 0;
            })
            .map(([id, data]) => ({
            id,
            name: data.name,
            endpoint: data.endpoint,
            description: data.description,
            category: data.category,
            products: data.products || (data.category === 'Partner APIs' ? ['Loan Genius', 'Card Genius'] : ['Card Genius']),
            methods: data.methods,
            purpose: data.purpose
          }));
          console.log('Home - Setting endpoints:', staticEndpoints);
          setEndpoints(staticEndpoints);
          return;
        }
        
        const response = await fetch(`${API_BASE_URL}/endpoints`);
        if (!response.ok) {
          throw new Error('Failed to fetch endpoints');
        }
        const data = await response.json();
        
        // Convert object to array format
        const endpointsArray = Object.entries(data)
          .sort((a, b) => {
            // Sort by rank first, then FIFO for equal ranks
            const rankA = a[1].rank || 999; // Default high rank for unranked items
            const rankB = b[1].rank || 999;
            
            console.log(`API - Comparing ${a[0]} (rank: ${rankA}) vs ${b[0]} (rank: ${rankB})`);
            
            if (rankA !== rankB) {
              return rankA - rankB; // Lower rank numbers appear first
            }
            
            // If ranks are equal, maintain FIFO order (return 0)
            return 0;
          })
          .map(([id, endpointData]) => ({
            id,
            name: endpointData.name,
            endpoint: endpointData.endpoint,
            description: endpointData.description,
            category: endpointData.category,
            products: endpointData.products || (endpointData.category === 'Partner APIs' ? ['Loan Genius', 'Card Genius'] : ['Card Genius']),
            methods: endpointData.methods,
            purpose: endpointData.purpose
          }));
        
        console.log('Home - API setting endpoints:', endpointsArray);
        setEndpoints(endpointsArray);
      } catch (err) {
        console.warn('API not available, falling back to static data:', err.message);
        // Fallback to static data if API is not available
        console.log('Home - Fallback to static data, apiData keys:', Object.keys(apiData));
        
        const staticEndpoints = Object.entries(apiData)
          .sort((a, b) => {
            // Sort by rank first, then FIFO for equal ranks
            const rankA = a[1].rank || 999; // Default high rank for unranked items
            const rankB = b[1].rank || 999;
            
            console.log(`Fallback - Comparing ${a[0]} (rank: ${rankA}) vs ${b[0]} (rank: ${rankB})`);
            
            if (rankA !== rankB) {
              return rankA - rankB; // Lower rank numbers appear first
            }
            
            // If ranks are equal, maintain FIFO order (return 0)
            return 0;
          })
          .map(([id, data]) => ({
          id,
          name: data.name,
          endpoint: data.endpoint,
          description: data.description,
          category: data.category,
          products: data.products || (data.category === 'Partner APIs' ? ['Loan Genius', 'Card Genius'] : ['Card Genius']),
          methods: data.methods,
          purpose: data.purpose
                  }));
          console.log('Home - Fallback setting endpoints:', staticEndpoints);
          setEndpoints(staticEndpoints);
      } finally {
        setLoading(false);
      }
    };
    fetchEndpoints();
  }, []);

  const organizeEndpointsByProduct = () => {
    const organized = {
      'Loan Genius': [],
      'Card Genius': [],
      'Education Genius': []
    };
    
    // Debug logging
    console.log('endpoints type:', typeof endpoints);
    console.log('endpoints:', endpoints);
    
    // Ensure endpoints is an array
    if (!Array.isArray(endpoints)) {
      console.warn('endpoints is not an array, using empty array');
      return organized;
    }
    
    endpoints.forEach(endpoint => {
      const products = endpoint.products || [endpoint.product];
      console.log(`Endpoint ${endpoint.id} has products:`, products);
      products.forEach(product => {
        if (organized[product]) {
          organized[product].push(endpoint);
          console.log(`Added ${endpoint.id} to ${product}`);
      } else {
        console.log(`Product ${product} not found in organized object`);
      }
      });
    });
    return organized;
  };
  const organizedApis = organizeEndpointsByProduct();
  console.log('Home - organizedApis:', organizedApis);

  const products = [
    {
      key: 'Card Genius',
      name: 'Card Genius',
      description: 'Advanced credit card sourcing and processing APIs with intelligent recommendations.',
      features: ['Card Sourcing', 'Smart Recommendations', 'Processing Engine', 'Analytics'],
      apiCount: organizedApis['Card Genius']?.length || 0,
      cta: 'Explore APIs',
      onClick: () => {
        const first = organizedApis['Card Genius'][0];
        if (first) {
          navigate(`/docs/${first.id}`);
        } else {
          // Fallback to a default endpoint if none are available
          console.log('No Card Genius endpoints available, navigating to default');
          navigate('/docs/partner-auth');
        }
      },
      theme: productThemes['Card Genius'],
      featured: true
    },
    {
      key: 'Loan Genius',
      name: 'Loan Genius',
      description: 'Comprehensive APIs for loan processing, lead generation, and financial product management.',
      features: ['Lead Generation', 'Loan Processing', 'Partner Integration', 'Real-time Updates'],
      apiCount: organizedApis['Loan Genius']?.length || 0,
      cta: 'Explore APIs',
      onClick: () => {
        const first = organizedApis['Loan Genius'][0];
        if (first) {
          navigate(`/docs/${first.id}`);
        } else {
          // Fallback to a default endpoint if none are available
          console.log('No Loan Genius endpoints available, navigating to default');
          navigate('/docs/partner-auth');
        }
      },
      theme: productThemes['Loan Genius']
    },
    {
      key: 'Education Genius',
      name: 'Education Genius',
      description: 'Specialized APIs for education loan products and student financial services.',
      features: ['Education Loans', 'Student Services', 'Institution Integration', 'Scholarship Matching'],
      apiCount: 0,
      cta: 'Explore APIs',
      onClick: () => navigate('/educationgenius'),
      theme: productThemes['Education Genius'],
      comingSoon: true
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 10,
          mb: 8,
          position: 'relative',
          overflow: 'hidden',
          mx: { xs: 2, sm: 4, md: 6, lg: 8 }, // Fixed gutter space
          borderRadius: 2
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 900, mx: 'auto' }}>
            <Typography 
              variant="h1" 
              sx={{ fontWeight: 'bold', mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1.2 }}
            >
              BankKaro API Hub
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ mb: 4, opacity: 0.9, fontSize: { xs: '1.25rem', md: '1.5rem' }, fontWeight: 300 }}
            >
              Comprehensive financial APIs for modern banking solutions
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ opacity: 0.8, mb: 6, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
            >
              Access powerful APIs for loan processing, credit card management, and education financing. 
              Built for developers, designed for scale.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{ background: '#fff', color: '#764ba2', fontWeight: 'bold', px: 4, boxShadow: 2, mt: 2 }}
              onClick={() => {
                const el = document.getElementById('products-section');
                if (el) {
                  const headerHeight = 64; // Height of the fixed header
                  const elementPosition = el.offsetTop - headerHeight - 20; // 20px extra padding
                  window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                  });
                }
              }}
            >
              Get Started
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 3, md: 6 }, flexWrap: 'wrap', mt: 6 }}>
              <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>{endpoints.length}</Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, fontWeight: 500 }}>API Endpoints</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>3</Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, fontWeight: 500 }}>Product Suites</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>99.9%</Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, fontWeight: 500 }}>Uptime</Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Product Cards Section */}
      <Container maxWidth="md" id="products-section" sx={{ 
        mb: 10,
        px: { xs: 2, sm: 4, md: 6, lg: 8 } // Fixed gutter space
      }}>
        <Stack spacing={4}>
          {products.map((product) => (
            <Box
              key={product.key}
              onClick={product.comingSoon ? undefined : product.onClick}
              sx={{
                cursor: product.comingSoon ? 'default' : 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: product.comingSoon ? 'none' : 'translateY(-4px)'
                }
              }}
            >
              <Card
                sx={{
                  background: product.theme.bg,
                  border: product.featured ? `2px solid ${product.theme.color}` : 'none',
                  boxShadow: product.featured ? 6 : 2,
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'visible',
                  minHeight: 220,
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: product.comingSoon ? 2 : 10
                  }
                }}
              >
                {product.featured && (
                  <Chip
                    icon={<StarIcon sx={{ color: product.theme.color }} />}
                    label="Featured"
                    sx={{ position: 'absolute', top: 18, right: 18, fontWeight: 'bold', background: '#fff', color: product.theme.color, zIndex: 2 }}
                  />
                )}
                {product.comingSoon && (
                  <Chip
                    label="Coming Soon"
                    color="warning"
                    sx={{ position: 'absolute', top: 18, right: 18, fontWeight: 'bold', zIndex: 2 }}
                  />
                )}
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 4, py: 4 }}>
                  <Avatar sx={{ bgcolor: product.theme.color, width: 72, height: 72, fontSize: 40 }}>
                    {product.theme.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: product.theme.color }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, color: '#444' }}>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {product.features.map((feature, idx) => (
                        <Chip key={idx} label={feature} size="small" sx={{ background: product.theme.color, color: '#fff', fontWeight: 500 }} />
                      ))}
                    </Box>
                    <Chip
                      label={`${product.apiCount} APIs`}
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 'bold', mr: 2 }}
                    />
                  </Box>
                  <CardActions sx={{ alignSelf: 'flex-start' }}>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        background: product.theme.color,
                        color: '#fff',
                        fontWeight: 'bold',
                        px: 3,
                        boxShadow: 2,
                        '&:hover': { background: product.theme.color, opacity: 0.9 }
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click when button is clicked
                        if (!product.comingSoon) {
                          product.onClick();
                        }
                      }}
                      disabled={product.comingSoon}
                    >
                      {product.cta}
                    </Button>
                  </CardActions>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Stack>
      </Container>

      {/* Value Proposition Section */}
      <Paper elevation={0} sx={{ 
        py: 8, 
        backgroundColor: '#f1f5f9', 
        mb: 0,
        mx: { xs: 2, sm: 4, md: 6, lg: 8 }, // Fixed gutter space
        borderRadius: 2
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            Why Choose BankKaro APIs?
          </Typography>
          <Typography variant="h6" sx={{ textAlign: 'center', color: 'text.secondary', mb: 6 }}>
            Built for developers, designed for enterprise
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="center" alignItems="center">
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <SpeedIcon sx={{ fontSize: 40, color: '#3b82f6', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                High Performance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Optimized APIs with sub-100ms response times and 99.9% uptime guarantee.
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <SecurityIcon sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Enterprise Security
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bank-grade security with OAuth 2.0, encryption, and compliance standards.
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: '#8b5cf6', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Scalable Architecture
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Built to handle millions of requests with automatic scaling and load balancing.
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <SupportAgentIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Dedicated Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                24/7 technical support and onboarding assistance for your team.
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Paper>

      {/* Final CTA Section */}
      <Paper elevation={0} sx={{ 
        py: 8, 
        background: 'linear-gradient(90deg, #667eea 0%, #8b5cf6 100%)', 
        color: '#fff', 
        mt: 0,
        mx: { xs: 2, sm: 4, md: 6, lg: 8 }, // Fixed gutter space
        borderRadius: 2
      }}>
        <Container maxWidth="md" sx={{ 
          textAlign: 'center',
          px: { xs: 2, sm: 4, md: 6, lg: 8 } // Fixed gutter space
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to build with BankKaro APIs?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Start exploring our documentation or contact us for a personalized demo.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ background: '#fff', color: '#764ba2', fontWeight: 'bold', px: 5, boxShadow: 2 }}
            onClick={() => {
              const first = organizedApis['Card Genius'][0];
              if (first) {
                navigate(`/docs/${first.id}`);
              } else {
                alert('No Card Genius APIs are available yet.');
              }
            }}
          >
            Explore Documentation
          </Button>
        </Container>
      </Paper>
    </Box>
  );
};

export default Home; 