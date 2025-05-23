package com.f1chatter.backend.service

import com.f1chatter.backend.repository.ConstructorRepository
import com.f1chatter.backend.repository.DriverRepository
import com.f1chatter.backend.repository.RaceRepository
import mu.KotlinLogging
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
@EnableScheduling
class DataSyncService(
    private val jolpicaApiService: JolpicaApiService,
    private val raceRepository: RaceRepository,
    private val driverRepository: DriverRepository,
    private val constructorRepository: ConstructorRepository,
    private val predictionService: PredictionService
) {
    private val logger = KotlinLogging.logger {}
    
    // Reduced frequency to once per week to minimize API calls
    @Scheduled(cron = "0 0 0 * * SUN") // At midnight on Sunday
    fun syncCurrentSeasonData() {
        // First check if we need to sync race data
        val currentSeason = 2025
        val existingRaces = raceRepository.findBySeason(currentSeason)
        
        if (existingRaces.isEmpty()) {
            logger.info { "Syncing current season race data" }
            jolpicaApiService.fetchCurrentSeasonRaces()
        } else {
            logger.info { "Races for season $currentSeason already exist, skipping race sync" }
        }
    }
    
    // Reduced frequency to once per week to minimize API calls
    @Scheduled(cron = "0 0 1 * * SUN") // At 1 AM on Sunday
    fun syncDriverData() {
        // Check if we have drivers and constructors
        val driversExist = driverRepository.count() > 0
        val constructorsExist = constructorRepository.count() > 0
        
        if (!driversExist || !constructorsExist) {
            logger.info { "Syncing driver and constructor data" }
            jolpicaApiService.fetchDriversForSeason()
        } else {
            logger.info { "Drivers and constructors already exist, skipping driver sync" }
        }
    }
    
    // Keep checking for completed races more frequently
    @Scheduled(fixedRate = 3600000) // Once per hour
    fun checkForCompletedRaces() {
        logger.info { "Checking for completed races to update results" }
        
        val yesterday = LocalDate.now().minusDays(1)
        val recentRaces = raceRepository.findUpcomingRaces(yesterday)
            .filter { !it.raceCompleted && it.date.isBefore(LocalDate.now()) }
        
        if (recentRaces.isEmpty()) {
            logger.info { "No recent races need to be updated" }
            return
        }
        
        // Process races one at a time with a small delay to avoid rate limiting
        recentRaces.forEachIndexed { index, race ->
            if (index > 0) {
                try {
                    // Add a delay between processing different races
                    Thread.sleep(2000)
                } catch (e: InterruptedException) {
                    Thread.currentThread().interrupt()
                }
            }
            
            logger.info { "Updating results for race: ${race.raceName}" }
            jolpicaApiService.updateRaceResults(race.id)
            
            try {
                predictionService.calculateScores(race.id)
                logger.info { "Calculated prediction scores for race: ${race.raceName}" }
            } catch (e: Exception) {
                logger.error(e) { "Failed to calculate scores for race: ${race.raceName}" }
            }
        }
    }
    
    // Run at startup to initialize data if needed
    fun initializeData() {
        logger.info { "Initializing F1 data if needed" }
        
        // Check if we have any race data
        val hasRaces = raceRepository.count() > 0
        if (!hasRaces) {
            logger.info { "No races found in database, syncing race data" }
            syncCurrentSeasonData()
        } else {
            logger.info { "Races already exist in database, skipping race sync" }
        }
        
        // Check if we have driver data
        val hasDrivers = driverRepository.count() > 0
        val hasConstructors = constructorRepository.count() > 0
        
        if (!hasDrivers || !hasConstructors) {
            logger.info { "Missing driver or constructor data, syncing driver data" }
            
            // Wait 5 seconds before syncing drivers to avoid rate limiting
            try {
                Thread.sleep(5000)
            } catch (e: InterruptedException) {
                Thread.currentThread().interrupt()
            }
            
            syncDriverData()
        } else {
            logger.info { "Drivers and constructors already exist in database, skipping driver sync" }
        }
    }
} 