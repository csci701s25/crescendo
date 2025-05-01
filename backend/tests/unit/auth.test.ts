// TODO: check that handleCallback works

// TODO: check that refresh token is working
import { SpotifyAuthController } from '../../src/controllers/auth';
import { SpotifyAuthService } from '../../src/services/auth/spotifyService';
import { Request, Response } from 'express';

// Mock supabase
jest.mock('../../src/config/supabase');

// Mock the SpotifyAuthService
jest.mock('../../src/services/auth/spotifyService');


describe('SpotifyAuthController', () => {
  let controller: SpotifyAuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    controller = new SpotifyAuthController();
    jsonMock = jest.fn();
    mockResponse = {
      json: jsonMock,
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('handleCallback', () => {
    it('should handle valid authorization code', async () => {
      // Arrange
      const mockCode = 'valid_code';
      const mockUserData = {
        tokens: {
          accessToken: 'mock_access_token',
          refreshToken: 'mock_refresh_token',
          expiresIn: 3600
        },
        profile: {
          id: 'user123',
          email: 'test@example.com',
          display_name: 'Test User',
          profile_image_url: 'http://example.com/image.jpg'
        }
      };

      mockRequest = {
        query: { code: mockCode }
      };

      (SpotifyAuthService.prototype.handleCallback as jest.Mock)
        .mockResolvedValueOnce(mockUserData);

      // Act
      await controller.handleCallback(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockUserData
      });
    });

    it('should return 400 for missing code', async () => {
      // Arrange
      mockRequest = {
        query: {}
      };

      // Act
      await controller.handleCallback(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Valid authorization code required'
      });
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token successfully', async () => {
      // Arrange
      const mockRefreshToken = 'valid_refresh_token';
      const mockTokenData = {
        accessToken: 'new_access_token',
        expiresIn: 3600
      };

      mockRequest = {
        body: { refreshToken: mockRefreshToken }
      };

      (SpotifyAuthService.prototype.refreshAccessToken as jest.Mock)
        .mockResolvedValueOnce(mockTokenData);

      // Act
      await controller.refreshAccessToken(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockTokenData
      });
    });

    it('should return 400 for missing refresh token', async () => {
      // Arrange
      mockRequest = {
        body: {}
      };

      // Act
      await controller.refreshAccessToken(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Refresh token is required'
      });
    });
  });
});